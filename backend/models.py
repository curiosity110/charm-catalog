"""Data access helpers for the lightweight API backend."""
from __future__ import annotations

import re
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from .database import db_cursor, get_connection

ISO_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime(ISO_FORMAT)


def _bool(value: int | bool) -> bool:
    return bool(value)


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9-]", "", re.sub(r"\s+", "-", value.lower())).strip("-")
    slug = re.sub(r"-+", "-", slug)
    return slug or uuid4().hex


@dataclass
class ProductImage:
    id: str
    product_id: str
    url: str
    is_primary: bool
    sort_order: int
    created_at: str


@dataclass
class Product:
    id: str
    title: str
    slug: str
    description: str
    price_cents: int
    active: bool
    created_at: str
    updated_at: str
    product_images: List[ProductImage] = field(default_factory=list)


@dataclass
class OrderItem:
    id: str
    order_id: str
    product_id: str
    quantity: int
    price_cents_at_purchase: int
    created_at: str
    product: Optional[Dict[str, Any]] = None


@dataclass
class Order:
    id: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str]
    customer_address: Optional[str]
    payment_method: str
    status: str
    total_cents: int
    notes: Optional[str]
    created_at: str
    updated_at: str
    order_items: List[OrderItem] = field(default_factory=list)


def serialize_product(row: Any) -> Product:
    return Product(
        id=row["id"],
        title=row["title"],
        slug=row["slug"],
        description=row["description"] or "",
        price_cents=int(row["price_cents"]),
        active=_bool(row["active"]),
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


def serialize_product_image(row: Any) -> ProductImage:
    return ProductImage(
        id=row["id"],
        product_id=row["product_id"],
        url=row["url"],
        is_primary=_bool(row["is_primary"]),
        sort_order=int(row["sort_order"]),
        created_at=row["created_at"],
    )


def serialize_order(row: Any) -> Order:
    return Order(
        id=row["id"],
        customer_name=row["customer_name"],
        customer_phone=row["customer_phone"],
        customer_email=row["customer_email"],
        customer_address=row["customer_address"],
        payment_method=row["payment_method"],
        status=row["status"],
        total_cents=int(row["total_cents"]),
        notes=row["notes"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


def serialize_order_item(row: Any) -> OrderItem:
    return OrderItem(
        id=row["id"],
        order_id=row["order_id"],
        product_id=row["product_id"],
        quantity=int(row["quantity"]),
        price_cents_at_purchase=int(row["price_cents_at_purchase"]),
        created_at=row["created_at"],
    )


def list_products(search: Optional[str] = None) -> List[Dict[str, Any]]:
    sql = "SELECT * FROM products"
    params: List[Any] = []
    if search:
        sql += " WHERE lower(title) LIKE ? OR lower(description) LIKE ?"
        like_value = f"%{search.lower()}%"
        params.extend([like_value, like_value])
    sql += " ORDER BY datetime(created_at) DESC"

    with get_connection() as conn:
        rows = conn.execute(sql, params).fetchall()

    products: List[Dict[str, Any]] = []
    for row in rows:
        product = serialize_product(row)
        product.product_images = list_product_images(product.id)
        products.append(asdict(product))
    return products


def list_product_images(product_id: str) -> List[ProductImage]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT * FROM product_images
            WHERE product_id = ?
            ORDER BY is_primary DESC, sort_order ASC, datetime(created_at) ASC
            """,
            (product_id,),
        ).fetchall()
    return [serialize_product_image(row) for row in rows]


def get_product_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM products WHERE slug = ?", (slug,)).fetchone()
    if not row:
        return None
    product = serialize_product(row)
    product.product_images = list_product_images(product.id)
    return asdict(product)


def create_product(payload: Dict[str, Any]) -> Dict[str, Any]:
    title = (payload.get("title") or "").strip()
    if not title:
        raise ValueError("Title is required.")

    slug = (payload.get("slug") or _slugify(title)).strip()
    description = (payload.get("description") or "").strip()
    price_cents = int(payload.get("price_cents") or 0)
    if price_cents <= 0:
        raise ValueError("price_cents must be greater than 0.")
    active = bool(payload.get("active", True))

    now = _utc_now()
    product_id = payload.get("id") or str(uuid4())

    with db_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO products (id, title, slug, description, price_cents, active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (product_id, title, slug, description, price_cents, int(active), now, now),
        )

    images_payload = payload.get("product_images") or []
    for index, image_payload in enumerate(images_payload):
        create_product_image(product_id, image_payload, index)

    return get_product_by_slug(slug)  # type: ignore[return-value]


def create_product_image(product_id: str, payload: Dict[str, Any], fallback_order: int) -> ProductImage:
    image_id = payload.get("id") or str(uuid4())
    url = (payload.get("url") or "").strip()
    if not url:
        raise ValueError("Image url is required.")
    is_primary = bool(payload.get("is_primary", False))
    sort_order = int(payload.get("sort_order") or fallback_order)
    created_at = payload.get("created_at") or _utc_now()

    with db_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO product_images (id, product_id, url, is_primary, sort_order, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (image_id, product_id, url, int(is_primary), sort_order, created_at),
        )
    return ProductImage(
        id=image_id,
        product_id=product_id,
        url=url,
        is_primary=is_primary,
        sort_order=sort_order,
        created_at=created_at,
    )


def _fetch_product_price(product_id: str) -> int:
    with get_connection() as conn:
        row = conn.execute("SELECT price_cents FROM products WHERE id = ? AND active = 1", (product_id,)).fetchone()
    if not row:
        raise ValueError("Product not found or inactive.")
    return int(row["price_cents"])


def create_order(payload: Dict[str, Any]) -> Dict[str, Any]:
    customer_name = (payload.get("customer_name") or "").strip()
    customer_phone = (payload.get("customer_phone") or "").strip()
    customer_email = (payload.get("customer_email") or None) or None
    customer_address = (payload.get("customer_address") or None) or None
    notes = (payload.get("notes") or None) or None
    payment_method = (payload.get("payment_method") or "cash_on_delivery").strip() or "cash_on_delivery"
    status = "new"

    if not customer_name:
        raise ValueError("customer_name is required.")
    if not customer_phone:
        raise ValueError("customer_phone is required.")

    items_payload = payload.get("items")
    if not isinstance(items_payload, list) or not items_payload:
        raise ValueError("At least one item is required.")

    now = _utc_now()
    order_id = payload.get("id") or str(uuid4())

    order_items: List[Dict[str, Any]] = []
    total_cents = 0

    for raw_item in items_payload:
        product_id = (raw_item.get("product_id") or raw_item.get("productId") or "").strip()
        quantity = int(raw_item.get("quantity") or 0)
        if not product_id:
            raise ValueError("Each item requires a product_id.")
        if quantity <= 0:
            raise ValueError("quantity must be greater than 0.")

        price_cents = _fetch_product_price(product_id)
        total_cents += price_cents * quantity
        order_items.append(
            {
                "id": str(uuid4()),
                "order_id": order_id,
                "product_id": product_id,
                "quantity": quantity,
                "price_cents_at_purchase": price_cents,
                "created_at": now,
            }
        )

    if total_cents <= 0:
        raise ValueError("total_cents must be greater than 0.")

    with db_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO orders (
                id, customer_name, customer_phone, customer_email, customer_address,
                payment_method, status, total_cents, notes, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                order_id,
                customer_name,
                customer_phone,
                customer_email,
                customer_address,
                payment_method,
                status,
                total_cents,
                notes,
                now,
                now,
            ),
        )

    for item in order_items:
        with db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO order_items (id, order_id, product_id, quantity, price_cents_at_purchase, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    item["id"],
                    item["order_id"],
                    item["product_id"],
                    item["quantity"],
                    item["price_cents_at_purchase"],
                    item["created_at"],
                ),
            )

    return get_order(order_id)


def list_orders() -> List[Dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM orders ORDER BY datetime(created_at) DESC").fetchall()
    orders = []
    for row in rows:
        orders.append(get_order(row["id"]))
    return orders


def get_order(order_id: str) -> Dict[str, Any]:
    with get_connection() as conn:
        order_row = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
        if not order_row:
            raise ValueError("Order not found.")
        item_rows = conn.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,)).fetchall()

    order = serialize_order(order_row)
    items: List[OrderItem] = []
    for item_row in item_rows:
        item = serialize_order_item(item_row)
        product = get_product_with_id(item.product_id)
        if product:
            item.product = product
        items.append(item)
    order.order_items = items
    result = asdict(order)
    # convert nested dataclasses to dicts
    result["order_items"] = [asdict(item) for item in items]
    return result


def get_product_with_id(product_id: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if not row:
        return None
    product = serialize_product(row)
    product.product_images = list_product_images(product.id)
    return asdict(product)
