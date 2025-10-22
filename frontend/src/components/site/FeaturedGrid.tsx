import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProducts, type Product } from "@/lib/api";
import { formatEUR } from "@/lib/utils";
import { mockProducts } from "@/assets/products/mockProducts";

const FEATURED_COUNT = 3;

function selectFeaturedProducts(products: Product[]): Product[] {
  if (!products.length) {
    return mockProducts.slice(0, FEATURED_COUNT);
  }

  const sorted = [...products].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  return sorted.slice(0, FEATURED_COUNT);
}

export function FeaturedGrid() {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["featured-products"],
    queryFn: ({ signal }) => fetchProducts(undefined, signal),
    staleTime: 1000 * 60,
  });

  const featuredProducts = selectFeaturedProducts(products);

  const errorMessage =
    error?.message ||
    (error ? "Не можеме да ги вчитаме препорачаните производи." : null);

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

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(FEATURED_COUNT)].map((_, index) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredProducts.map((product) => {
              const currentPrice = Number(product.price) || 0;
              const oldPrice = Math.round(currentPrice * 1.15 * 100) / 100;
              const discount =
                oldPrice > 0
                  ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
                  : 0;
              const primaryImage =
                product.primary_image_url ||
                product.image ||
                product.image_url ||
                null;

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary-lighter/10 to-accent/20 relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-light/10">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={product.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-2">🌿</div>
                          <p className="text-xs text-muted-foreground">
                            Слика на производ
                          </p>
                        </div>
                      )}
                    </div>
                    {discount > 0 && (
                      <Badge className="absolute top-3 left-3 bg-destructive hover:bg-destructive/90">
                        -{discount}%
                      </Badge>
                    )}
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
                    <Button
                      asChild
                      className="flex-1 bg-[#0052cc] hover:bg-[#0065ff] text-white font-semibold"
                    >
                      <Link to={`/products/${product.slug}`}>Нарачај</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link to={`/products/${product.slug}`}>Повеќе инфо</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {errorMessage && (
          <div className="text-center text-destructive mb-12">
            {errorMessage}
          </div>
        )}

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to="/products">Видете ги сите производи</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
