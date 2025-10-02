import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProducts, type Product, type ProductImage } from "@/lib/api";
import { formatEUR } from "@/lib/utils";

const placeholderProducts = [
  {
    id: "placeholder-1",
    title: "Билна мешавина за имунитет",
    oldPrice: 250000,
    currentPrice: 199000,
    slug: "bilna-mesavina-imunitet"
  },
  {
    id: "placeholder-2",
    title: "Природен крем за лице",
    oldPrice: 180000,
    currentPrice: 149000,
    slug: "priroden-krem-lice"
  },
  {
    id: "placeholder-3",
    title: "Серум за коса",
    oldPrice: 220000,
    currentPrice: 179000,
    slug: "serum-kosa"
  },
  {
    id: "placeholder-4",
    title: "Детокс чај",
    oldPrice: 150000,
    currentPrice: 119000,
    slug: "detoks-caj"
  },
  {
    id: "placeholder-5",
    title: "Антиоксидантен комплекс",
    oldPrice: 280000,
    currentPrice: 239000,
    slug: "antioksidanten-kompleks"
  },
  {
    id: "placeholder-6",
    title: "Природно масло за тело",
    oldPrice: 190000,
    currentPrice: 159000,
    slug: "prirodno-maslo-telo"
  }
];

export function FeaturedGrid() {
  const [products, setProducts] = useState<(Product & { product_images?: ProductImage[] })[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const catalog = await fetchProducts();
        setProducts(catalog.slice(0, 6));
      } catch (error) {
        console.error("Error loading featured products:", error);
      }
    };

    load();
  }, []);

  const displayProducts = products.length ? products : placeholderProducts;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Препорачани производи
          </h2>
          <p className="text-lg text-muted-foreground">
            Откријте ги нашите најпопуларни природни решенија
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayProducts.map((product) => {
            const isPlaceholder = "currentPrice" in product;
            const currentPrice = isPlaceholder
              ? (product as typeof placeholderProducts[number]).currentPrice
              : (product as Product).price_cents;
            const oldPrice = isPlaceholder
              ? (product as typeof placeholderProducts[number]).oldPrice
              : Math.round((product as Product).price_cents * 1.15);
            const slug = (product as any).slug;
            const images = !isPlaceholder ? (product as Product & { product_images?: ProductImage[] }).product_images : undefined;
            const primaryImage = images && images.length ? images[0]?.url : null;

            return (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-lighter/10 to-accent/20 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-light/10">
                    {primaryImage ? (
                      <img src={primaryImage} alt={product.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2">🌿</div>
                        <p className="text-xs text-muted-foreground">Слика на производ</p>
                      </div>
                    )}
                  </div>

                  <Badge className="absolute top-3 left-3 bg-destructive hover:bg-destructive/90">
                    -{Math.round(((oldPrice - currentPrice) / oldPrice) * 100)}%
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3">
                    Природен производ со сертифицирани состојки за максимална ефикасност.
                  </p>

                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                      {formatEUR(currentPrice)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatEUR(oldPrice)}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button asChild className="flex-1 bg-primary hover:bg-primary-light">
                    <Link to={`/products/${slug}`}>Нарачај</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link to={`/products/${slug}`}>Повеќе инфо</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/products">Видете ги сите производи</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}