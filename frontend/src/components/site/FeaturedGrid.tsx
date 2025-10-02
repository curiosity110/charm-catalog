import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProducts, type Product, type ProductImage } from "@/lib/api";
import { formatEUR } from "@/lib/utils";

export function FeaturedGrid() {
  const [products, setProducts] = useState<(Product & { product_images?: ProductImage[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const catalog = await fetchProducts();
        setProducts(catalog.slice(0, 6));
        setError(null);
      } catch (error: any) {
        console.error("Error loading featured products:", error);
        setError(error?.message || "Не можеме да ги вчитаме препорачаните производи.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded mb-3 w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {products.map((product) => {
              const currentPrice = product.price_cents;
              const oldPrice = Math.round(product.price_cents * 1.15);
              const primaryImage = product.product_images?.[0]?.url;

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

                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {product.description}
                      </p>
                    )}

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
                      <Link to={`/products/${product.slug}`}>Нарачај</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link to={`/products/${product.slug}`}>Повеќе инфо</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-foreground mb-2">Нема препорачани производи</h3>
            <p className="text-muted-foreground">
              Штом објавите производи во административниот панел тие автоматски ќе се прикажат овде.
            </p>
          </div>
        )}

        {error && (
          <div className="text-center text-destructive mb-12">
            {error}
          </div>
        )}

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/products">Видете ги сите производи</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}