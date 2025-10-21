import type { Product } from "@/lib/types";

import imgArthro from "@/assets/products/ArhroVita.jpeg";
import imgCardi from "@/assets/products/CardiVita.jpeg";
import imgDia from "@/assets/products/DiaVita.jpeg";
import imgOpti from "@/assets/products/OptiVita.jpeg";
import imgPro from "@/assets/products/ProVita.jpeg";

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();

export const staticProducts: Product[] = [
  {
    id: "arthrovita",
    title: "ArthroVita – Поддршка за зглобови",
    slug: "arthrovita",
    description:
      "Формула за подмачкување и флексибилност на зглобови со глукозамин, хондроитин и МСМ.",
    price: 24.9,
    primary_image_url: imgArthro,
    created_at: daysAgo(2),
  },
  {
    id: "cardivita",
    title: "CardiVita – Здраво срце",
    slug: "cardivita",
    description:
      "Поддршка за кардиоваскуларно здравје со CoQ10, магнезиум и Б-витамини.",
    price: 21.9,
    primary_image_url: imgCardi,
    created_at: daysAgo(5),
  },
  {
    id: "diavita",
    title: "DiaVita – Рамнотежа на шеќер",
    slug: "diavita",
    description:
      "Билна поддршка за нормални нивоа на гликоза со цимет и берберин.",
    price: 22.5,
    primary_image_url: imgDia,
    created_at: daysAgo(8),
  },
  {
    id: "optivita",
    title: "OptiVita – Визија & очи",
    slug: "optivita",
    description:
      "Лутеин, зеаксантин и боровинка за заштита и удобност на очите.",
    price: 19.9,
    primary_image_url: imgOpti,
    created_at: daysAgo(11),
  },
  {
    id: "provita",
    title: "ProVita – Имунитет",
    slug: "provita",
    description:
      "Цинк, витамин C и D3 за дневна одбрана и енергија.",
    price: 17.9,
    primary_image_url: imgPro,
    created_at: daysAgo(14),
  },
];

export function findProductBySlug(slug: string): Product | undefined {
  return staticProducts.find((product) => product.slug === slug);
}

export function searchProducts(query?: string): Product[] {
  if (!query) {
    return staticProducts;
  }

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return staticProducts;
  }

  return staticProducts.filter((product) =>
    `${product.title ?? ""} ${product.description ?? ""} ${product.slug ?? ""}`
      .toLowerCase()
      .includes(normalized)
  );
}
