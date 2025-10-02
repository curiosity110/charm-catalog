import { products as staticProducts } from "@/data/products";
import type { Product, ProductImage } from "@/lib/types";

const NETWORK_DELAY = 300;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate fetching products from an API. Replace with real fetch calls later.
export async function fetchProducts(): Promise<(Product & { product_images?: ProductImage[] })[]> {
  await delay(NETWORK_DELAY);

  return staticProducts
    .filter((product) => product.active)
    .map((product) => ({
      ...product,
      product_images: product.product_images
        ? [...product.product_images].sort((a, b) => {
            if (a.is_primary && !b.is_primary) return -1;
            if (!a.is_primary && b.is_primary) return 1;
            return a.sort_order - b.sort_order;
          })
        : []
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function fetchProductBySlug(slug: string): Promise<(Product & { product_images?: ProductImage[] }) | null> {
  await delay(NETWORK_DELAY);

  const product = staticProducts.find((item) => item.slug === slug && item.active);
  if (!product) {
    return null;
  }

  return {
    ...product,
    product_images: product.product_images
      ? [...product.product_images].sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return a.sort_order - b.sort_order;
        })
      : []
  };
}

interface OrderRequestPayload {
  productId: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  notes?: string;
}

// Placeholder order submission that mimics a network request and logs the payload.
export async function submitOrderRequest(payload: OrderRequestPayload): Promise<void> {
  await delay(NETWORK_DELAY);
  console.info("Order request queued for backend integration", payload);
}

export type { Product, ProductImage };
