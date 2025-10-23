import { mockProducts } from "@/assets/products/mockProducts";
import type { Order, OrderItem, Product } from "@/lib/types";

const DEFAULT_API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

// Show all mock products by default (no random sampling)
const MOCK_PRODUCT_SAMPLE_SIZE = Infinity;

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

function matchesSearch(product: Product, search?: string): boolean {
  if (!search) {
    return true;
  }

  const haystack = `${product.title ?? ""} ${product.description ?? ""} ${product.slug ?? ""}`.toLowerCase();
  return haystack.includes(search.trim().toLowerCase());
}

function sampleMockProducts(search?: string): Product[] {
  const filtered = mockProducts.filter((product) => matchesSearch(product, search));
  return filtered;
}

export async function fetchProducts(search?: string, signal?: AbortSignal): Promise<Product[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";

  try {
    const data = await request<Product[]>(`/api/products${query}`, { signal });
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    console.warn("Product API returned no data. Falling back to mock products.");
  } catch (error) {
    console.warn("Failed to load products from API. Falling back to mock products.", error);
  }

  const fallback = sampleMockProducts(search);
  if (fallback.length === 0) {
    throw new Error("Нема достапни пример производи во моментов.");
  }

  return fallback;
}

export async function fetchProductBySlug(slug: string, signal?: AbortSignal): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${slug}`, { signal });

    if (response.status === 404) {
      console.warn(`Product with slug "${slug}" not found on API. Falling back to mock data.`);
    } else if (!response.ok) {
      const text = await response.text();
      const detail = text ? (JSON.parse(text) as { detail?: string }).detail : null;
      throw new Error(detail || response.statusText);
    } else {
      const product = (await response.json()) as Product;
      if (product) {
        return product;
      }
    }
  } catch (error) {
    console.warn(`Failed to load product "${slug}" from API. Using mock product if available.`, error);
  }

  return mockProducts.find((product) => product.slug === slug) ?? null;
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

function buildOrderBody(payload: OrderRequestPayload) {
  return {
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
}

function buildMockOrder(payload: OrderRequestPayload): Order {
  const createdAt = new Date().toISOString();

  const items: OrderItem[] = payload.items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
    product: mockProducts.find((product) => product.id === item.productId),
  }));

  return {
    id: `demo-${Date.now()}`,
    status: "pending",
    created_at: createdAt,
    customer_name: payload.customerName,
    customer_phone: payload.customerPhone,
    customer_email: payload.customerEmail ?? null,
    customer_address: payload.customerAddress ?? null,
    notes: payload.notes ?? null,
    items,
  };
}

export async function submitOrderRequest(payload: OrderRequestPayload): Promise<Order> {
  try {
    return await request<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(buildOrderBody(payload)),
    });
  } catch (error) {
    console.warn("Failed to submit order to API. Returning mock confirmation instead.", error);
    return buildMockOrder(payload);
  }
}

export type { Product };
