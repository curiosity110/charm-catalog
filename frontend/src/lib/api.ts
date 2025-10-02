import type { Order, Product } from "@/lib/types";

const DEFAULT_API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

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
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return request<Product[]>(`/api/products${query}`, { signal });
}

export async function fetchProductBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Product | null> {
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
