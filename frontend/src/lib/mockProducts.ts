import type { Product } from "@/lib/types";

import charmRelaxTonic from "@/assets/products/charm-relax-tonic.svg";
import herbalBalanceCapsules from "@/assets/products/herbal-balance-capsules.svg";
import moonlightSleepDrops from "@/assets/products/moonlight-sleep-drops.svg";
import vitalMorningElixir from "@/assets/products/vital-morning-elixir.svg";
import forestBreathBalm from "@/assets/products/forest-breath-balm.svg";
import radiantSkinSerum from "@/assets/products/radiant-skin-serum.svg";
import sereneTeaBlend from "@/assets/products/serene-tea-blend.svg";

const baseDate = new Date("2024-01-15T08:00:00.000Z");

const withDateOffset = (offsetDays: number) => {
  const created = new Date(baseDate);
  created.setDate(created.getDate() + offsetDays);
  return created.toISOString();
};

export const mockProducts: Product[] = [
  {
    id: "mock-charm-relax-tonic",
    slug: "charm-relax-tonic",
    title: "Charm Relax билен тоник",
    description:
      "Смирувачка комбинација од пасифлора, лаванда и витамин Б-комплекс за рамнотежа на нервниот систем.",
    price: 17.5,
    image: charmRelaxTonic,
    image_url: charmRelaxTonic,
    primary_image_url: charmRelaxTonic,
    active: true,
    created_at: withDateOffset(12),
    updated_at: withDateOffset(18),
  },
  {
    id: "mock-herbal-balance-capsules",
    slug: "herbal-balance-capsules",
    title: "Herbal Balance капсули",
    description:
      "Адаптогена мешавина од ашваганда, родиола и магнезиум за природна енергија и фокус во текот на денот.",
    price: 21.9,
    image: herbalBalanceCapsules,
    image_url: herbalBalanceCapsules,
    primary_image_url: herbalBalanceCapsules,
    active: true,
    created_at: withDateOffset(5),
    updated_at: withDateOffset(10),
  },
  {
    id: "mock-moonlight-sleep-drops",
    slug: "moonlight-sleep-drops",
    title: "Moonlight капки за сон",
    description:
      "Валеријана, маточина и есенција од портокал за смирувачки ритуал пред спиење и побрзо заспивање.",
    price: 14.3,
    image: moonlightSleepDrops,
    image_url: moonlightSleepDrops,
    primary_image_url: moonlightSleepDrops,
    active: true,
    created_at: withDateOffset(8),
    updated_at: withDateOffset(12),
  },
  {
    id: "mock-vital-morning-elixir",
    slug: "vital-morning-elixir",
    title: "Vital Morning еликсир",
    description:
      "Златна формула со куркума, ѓумбир и лимон за детокс, имунитет и свеж старт на секој ден.",
    price: 19.8,
    image: vitalMorningElixir,
    image_url: vitalMorningElixir,
    primary_image_url: vitalMorningElixir,
    active: true,
    created_at: withDateOffset(2),
    updated_at: withDateOffset(6),
  },
  {
    id: "mock-forest-breath-balm",
    slug: "forest-breath-balm",
    title: "Forest Breath билна маст",
    description:
      "Силно ароматична маст со еукалиптус, бор и мајчина душичка за лесно дишење и чувство на свежина.",
    price: 11.5,
    image: forestBreathBalm,
    image_url: forestBreathBalm,
    primary_image_url: forestBreathBalm,
    active: true,
    created_at: withDateOffset(-2),
    updated_at: withDateOffset(4),
  },
  {
    id: "mock-radiant-skin-serum",
    slug: "radiant-skin-serum",
    title: "Radiant Skin серум",
    description:
      "Концентриран серум со хијалурон, витамин Ц и коензим Q10 за обновена и блескава кожа.",
    price: 29.4,
    image: radiantSkinSerum,
    image_url: radiantSkinSerum,
    primary_image_url: radiantSkinSerum,
    active: true,
    created_at: withDateOffset(15),
    updated_at: withDateOffset(20),
  },
  {
    id: "mock-serene-tea-blend",
    slug: "serene-tea-blend",
    title: "Serene билен чај",
    description:
      "Мек билен чај со камилица, лаванда и розови листови за моменти на мир и балансирање.",
    price: 9.6,
    image: sereneTeaBlend,
    image_url: sereneTeaBlend,
    primary_image_url: sereneTeaBlend,
    active: true,
    created_at: withDateOffset(-8),
    updated_at: withDateOffset(-2),
  },
];

export function findMockProductBySlug(slug: string): Product | null {
  const product = mockProducts.find((item) => item.slug === slug);
  return product ?? null;
}

export function searchMockProducts(search?: string): Product[] {
  const normalized = (search || "").trim().toLocaleLowerCase();
  if (!normalized) {
    return [...mockProducts];
  }

  return mockProducts.filter((product) => {
    const haystack = [product.title, product.description]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    return haystack.includes(normalized);
  });
}
