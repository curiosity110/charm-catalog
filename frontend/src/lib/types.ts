export type Product = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number | string;
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

export async function fetchProducts(
  search?: string,
  signal?: AbortSignal
): Promise<Product[]> {
  if (USE_MOCKS) {
    const all = await loadMocks();
    if (!search) return all;
    const s = search.toLowerCase();
    return all.filter((p) =>
      `${p.title ?? ""} ${p.description ?? ""} ${p.slug ?? ""}`
        .toLowerCase()
        .includes(s)
    );
  }

  // ---- Real API path (keep your existing code here) ----
  // Example:
  const url = new URL("/api/products", window.location.origin);
  if (search) url.searchParams.set("search", search);
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error("Грешка при вчитување на производи.");
  const data: Product[] = await res.json();

  // Fallback: if server returns empty, give mocks (nice for demos)
  if (!data || data.length === 0) {
    const all = await loadMocks();
    if (!search) return all;
    const s = search.toLowerCase();
    return all.filter((p) =>
      `${p.title ?? ""} ${p.description ?? ""} ${p.slug ?? ""}`
        .toLowerCase()
        .includes(s)
    );
  }

  return data;
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
  const res = await fetch(url.toString(), { signal });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Грешка при вчитување на производ.");
  const product: Product = await res.json();

  // If API returns nothing, try mocks as a safety
  if (!product) {
    const all = await loadMocks();
    return all.find((p) => p.slug === slug) ?? null;
  }
  return product;
}
