export type Product = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number | string;
  original_price?: number | string;
  compare_at_price?: number | string;
  currency?: string;
  primary_image_url?: string;
  image?: string;
  image_url?: string;
  created_at?: string;
  // add any fields your CartContext expects (e.g., sku, stock, etc.)
};

const USE_MOCKS = import.meta.env?.VITE_USE_MOCK_PRODUCTS === "true";

// Lazy import so tree-shaking works nicely
async function loadMocks(): Promise<Product[]> {
  const mod = await import("@/assets/products/mockProducts");
  return mod.mockProducts;
}

async function queryMocks(search?: string): Promise<Product[]> {
  const all = await loadMocks();
  if (!search) return all;
  const s = search.toLowerCase();
  return all.filter((p) =>
    `${p.title ?? ""} ${p.description ?? ""} ${p.slug ?? ""}`.toLowerCase().includes(s)
  );
}

export async function fetchProducts(
  search?: string,
  signal?: AbortSignal
): Promise<Product[]> {
  if (USE_MOCKS) {
    return queryMocks(search);
  }

  // ---- Real API path (keep your existing code here) ----
  // Example:
  const url = new URL("/api/products", window.location.origin);
  if (search) url.searchParams.set("search", search);

  try {
    const res = await fetch(url.toString(), { signal });
    if (!res.ok) {
      if (res.status === 404) {
        return queryMocks(search);
      }
      throw new Error("Грешка при вчитување на производи.");
    }
    const data: Product[] = await res.json();

    if (!data || data.length === 0) {
      return queryMocks(search);
    }

    return data;
  } catch (error) {
    console.warn("Falling back to mock products", error);
    return queryMocks(search);
  }
}

export async function fetchProductBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Product | null> {
  if (USE_MOCKS) {
    const all = await loadMocks();
    return all.find((p) => p.slug === slug) ?? null;
  }

  // ---- Real API path (keep your existing code here) ----
  // Example:
  const url = new URL(`/api/products/${slug}`, window.location.origin);

  try {
    const res = await fetch(url.toString(), { signal });
    if (res.status === 404) {
      const all = await loadMocks();
      return all.find((p) => p.slug === slug) ?? null;
    }
    if (!res.ok) {
      throw new Error("Грешка при вчитување на производ.");
    }
    const product: Product | null = await res.json();

    if (!product) {
      const all = await loadMocks();
      return all.find((p) => p.slug === slug) ?? null;
    }
    return product;
  } catch (error) {
    console.warn("Falling back to mock product", error);
    const all = await loadMocks();
    return all.find((p) => p.slug === slug) ?? null;
  }
}
