import type { Product } from "@/lib/types";

import imgArthro from "./ArhroVita.jpeg";
import imgCardi from "./CardiVita.jpeg";
import imgDia from "./DiaVita.jpeg";
import imgOpti from "./OptiVita.jpeg";
import imgPro from "./ProVita.jpeg";
import imgVitaFit from "./VitaFit.jpeg";
import imgStallion from "./Stallion Power.jpeg";

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

export const mockProducts: Product[] = [
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
    created_at: daysAgo(1),
  },
  {
    id: "diavita",
    title: "DiaVita – Рамнотежа на шеќер",
    slug: "diavita",
    description:
      "Билна поддршка за нормални нивоа на гликоза со цимет и берберин.",
    price: 22.5,
    primary_image_url: imgDia,
    created_at: daysAgo(4),
  },
  {
    id: "optivita",
    title: "OptiVita – Визија & очи",
    slug: "optivita",
    description:
      "Лутеин, зеаксантин и боровинка за заштита и удобност на очите.",
    price: 19.9,
    primary_image_url: imgOpti,
    created_at: daysAgo(7),
  },
  {
    id: "provita",
    title: "ProVita – Имунитет",
    slug: "provita",
    description:
      "Цинк, витамин C и D3 за дневна одбрана и енергија.",
    price: 17.9,
    primary_image_url: imgPro,
    created_at: daysAgo(10),
  },
  {
    id: "vitafit",
    title: "VitaFit – Дневен мултивитамин",
    slug: "vitafit",
    description:
      "Комплет од 23 нутриенти за тонус и виталност.",
    price: 15.9,
    primary_image_url: imgVitaFit,
    created_at: daysAgo(12),
  },
  {
    id: "stallion-power",
    title: "Stallion Power – Машка енергија",
    slug: "stallion-power",
    description:
      "Природна формула за сила и издржливост со мака и цинк.",
    price: 29.9,
    primary_image_url: imgStallion,
    created_at: daysAgo(3),
  },
];
