import type { Product } from "@/lib/types";

// Static product catalog used while backend APIs are under development.
// Replace this data with real API calls once the Django backend is ready.
export const products: Product[] = [
  {
    id: "calming-tea",
    title: "Смирувачки билен чај",
    slug: "smiruvachki-bilen-chaj",
    description:
      "Рачно подготвен билен чај со комбинација од маточина, камилица и лаванда за природно смирување.",
    price_cents: 1299,
    active: true,
    created_at: "2024-02-15T10:00:00.000Z",
    updated_at: "2024-02-15T10:00:00.000Z",
    product_images: [
      {
        id: "calming-tea-primary",
        product_id: "calming-tea",
        url: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&w=900&q=80",
        is_primary: true,
        sort_order: 0,
        created_at: "2024-02-15T10:00:00.000Z"
      },
      {
        id: "calming-tea-secondary",
        product_id: "calming-tea",
        url: "https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&w=900&q=80",
        is_primary: false,
        sort_order: 1,
        created_at: "2024-02-15T10:00:00.000Z"
      }
    ]
  },
  {
    id: "herbal-balm",
    title: "Балсам од билки",
    slug: "balsam-od-bilki",
    description:
      "Природен балсам за смирување на кожа со невен, кантарион и кокосово масло.",
    price_cents: 1899,
    active: true,
    created_at: "2024-01-28T10:00:00.000Z",
    updated_at: "2024-01-28T10:00:00.000Z",
    product_images: [
      {
        id: "herbal-balm-primary",
        product_id: "herbal-balm",
        url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
        is_primary: true,
        sort_order: 0,
        created_at: "2024-01-28T10:00:00.000Z"
      },
      {
        id: "herbal-balm-secondary",
        product_id: "herbal-balm",
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
        is_primary: false,
        sort_order: 1,
        created_at: "2024-01-28T10:00:00.000Z"
      }
    ]
  },
  {
    id: "immune-tincture",
    title: "Тинктура за имунитет",
    slug: "tinktura-za-imunitet",
    description:
      "Силна тинктура со ехинацеа, ѓумбир и црн дроб за поддршка на природната одбрана на организмот.",
    price_cents: 2499,
    active: true,
    created_at: "2024-03-05T10:00:00.000Z",
    updated_at: "2024-03-05T10:00:00.000Z",
    product_images: [
      {
        id: "immune-tincture-primary",
        product_id: "immune-tincture",
        url: "https://images.unsplash.com/photo-1590431251973-3016c2323b10?auto=format&fit=crop&w=900&q=80",
        is_primary: true,
        sort_order: 0,
        created_at: "2024-03-05T10:00:00.000Z"
      },
      {
        id: "immune-tincture-secondary",
        product_id: "immune-tincture",
        url: "https://images.unsplash.com/photo-1471943038886-87c772c0c8c1?auto=format&fit=crop&w=900&q=80",
        is_primary: false,
        sort_order: 1,
        created_at: "2024-03-05T10:00:00.000Z"
      }
    ]
  },
  {
    id: "aroma-oil",
    title: "Ароматично масло за релаксација",
    slug: "aromatichno-maslo-za-relaksacija",
    description:
      "Комбинација од етерични масла од портокал, сандалово дрво и бергамот за момент на релаксација.",
    price_cents: 2199,
    active: true,
    created_at: "2024-02-01T10:00:00.000Z",
    updated_at: "2024-02-01T10:00:00.000Z",
    product_images: [
      {
        id: "aroma-oil-primary",
        product_id: "aroma-oil",
        url: "https://images.unsplash.com/photo-1523296506510-4c4f8c83d75b?auto=format&fit=crop&w=900&q=80",
        is_primary: true,
        sort_order: 0,
        created_at: "2024-02-01T10:00:00.000Z"
      },
      {
        id: "aroma-oil-secondary",
        product_id: "aroma-oil",
        url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
        is_primary: false,
        sort_order: 1,
        created_at: "2024-02-01T10:00:00.000Z"
      }
    ]
  }
];
