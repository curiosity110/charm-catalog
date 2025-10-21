import type { Order, Product } from "@/lib/types";
import { findMockProductBySlug, mockProducts, searchMockProducts } from "@/lib/mockProducts";

const DEFAULT_API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
const USE_MOCK_API = (import.meta.env.VITE_USE_MOCK_API ?? "true").toLowerCase() !== "false";

type RequestOptions = RequestInit & { signal?: AbortSignal };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T & { detail?: string }) : null;

  if (!response.ok) {
    const detail = (data && typeof data === "object" && "detail" in data && data.detail) || response.statusText;
    throw new Error(detail || "Request failed");
  }

  return data as T;
}

export async function fetchProducts(search?: string, signal?: AbortSignal): Promise<Product[]> {
  if (!USE_MOCK_API) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return request<Product[]>(`/api/products${query}`, { signal });
  }

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const results = searchMockProducts(search);

  await new Promise((resolve) => setTimeout(resolve, 120));

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  return results;
}

export async function fetchProductBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Product | null> {
  if (!USE_MOCK_API) {
    const response = await fetch(`${API_BASE_URL}/api/products/${slug}`, { signal });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const text = await response.text();
      const detail = text ? (JSON.parse(text) as { detail?: string }).detail : null;
      throw new Error(detail || response.statusText);
    }

    const data = (await response.json()) as Product;
    return data;
  }

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const product = findMockProductBySlug(slug);

  await new Promise((resolve) => setTimeout(resolve, 120));

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  return product;
}

export interface OrderRequestPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  notes?: string;
  paymentMethod?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export async function submitOrderRequest(payload: OrderRequestPayload): Promise<Order> {
  if (USE_MOCK_API) {
    const now = new Date().toISOString();
    const id = `MOCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const total = payload.items.reduce((sum, item) => {
      const product = mockProducts.find((mock) => mock.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const order: Order = {
      id,
      customer_name: payload.customerName,
      customer_phone: payload.customerPhone,
      customer_email: payload.customerEmail,
      customer_address: payload.customerAddress,
      status: "new",
      payment_method: payload.paymentMethod || "cash_on_delivery",
      total_price: Number(total.toFixed(2)),
      notes: payload.notes,
      created_at: now,
      updated_at: now,
      order_items: payload.items.map((item, index) => {
        const product = mockProducts.find((mock) => mock.id === item.productId);
        return {
          id: `${id}-ITEM-${index + 1}`,
          order_id: id,
          product_id: item.productId,
          quantity: item.quantity,
          price_at_purchase: Number(((product?.price || 0) * item.quantity).toFixed(2)),
          created_at: now,
          product: product ?? undefined,
        };
      }),
    };

    await new Promise((resolve) => setTimeout(resolve, 180));

    return order;
  }

  const body = {
    customer_name: payload.customerName,
    customer_phone: payload.customerPhone,
    customer_email: payload.customerEmail,
    customer_address: payload.customerAddress,
    notes: payload.notes,
    payment_method: payload.paymentMethod || "cash_on_delivery",
    items: payload.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
  };

  return request<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type { Product };
