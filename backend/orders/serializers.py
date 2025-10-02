"""Serializers for order management."""
from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict

from rest_framework import serializers

from catalog.models import Product
from catalog.serializers import ProductSerializer
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """Serialize order line items."""

    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    price_at_purchase = serializers.DecimalField(
        max_digits=10, decimal_places=2, coerce_to_string=False, read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_id",
            "quantity",
            "price_at_purchase",
            "created_at",
        ]
        read_only_fields = ["id", "price_at_purchase", "created_at", "product"]

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        quantity = attrs.get("quantity", 0)
        if quantity <= 0:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return attrs

    def to_representation(self, instance: OrderItem) -> Dict[str, Any]:
        representation = super().to_representation(instance)
        representation["product_id"] = str(instance.product_id)
        representation["order_id"] = str(instance.order_id)
        return representation


class OrderSerializer(serializers.ModelSerializer):
    """Serialize orders with nested items."""

    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, coerce_to_string=False, read_only=True
    )
    order_items = OrderItemSerializer(many=True, read_only=True)
    items = OrderItemSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer_name",
            "customer_phone",
            "customer_email",
            "customer_address",
            "payment_method",
            "status",
            "total_price",
            "notes",
            "created_at",
            "updated_at",
            "order_items",
            "items",
        ]
        read_only_fields = ["id", "status", "total_price", "created_at", "updated_at", "order_items"]

    def create(self, validated_data: Dict[str, Any]) -> Order:
        items_data = validated_data.pop("items", [])
        order = Order.objects.create(**validated_data)
        total_price = Decimal("0.00")

        for item_data in items_data:
            product_id = item_data.pop("product_id")
            product = Product.objects.filter(id=product_id, active=True).first()
            if not product:
                raise serializers.ValidationError({"items": "Product not found or inactive."})
            quantity = item_data["quantity"]
            price = product.price
            total_price += price * quantity
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price_at_purchase=price,
            )

        if total_price <= 0:
            raise serializers.ValidationError({"items": "At least one valid item is required."})

        order.total_price = total_price
        order.save(update_fields=["total_price"])
        return order

    def to_representation(self, instance: Order) -> Dict[str, Any]:
        return super().to_representation(instance)
