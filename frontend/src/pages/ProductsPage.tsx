import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Grid, List, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProducts, type Product } from "@/lib/api";
import { formatMKD } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addItem, openCart } = useCart();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const searchQuery = useMemo(() => (searchParams.get("search") || "").trim(), [searchParams]);
  const normalizedSearchQuery = useMemo(() => searchQuery.toLocaleLowerCase(), [searchQuery]);

  const {
    data: products = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products", normalizedSearchQuery],
    queryFn: ({ signal }) => fetchProducts(normalizedSearchQuery || undefined, signal),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (!error) {
      return;
    }

    toast({
      title: "Грешка",
      description: error.message || "Не можеме да ги вчитаме производите во моментов.",
      variant: "destructive",
    });
  }, [error, toast]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    toast({
      title: "Додадено во кошничка",
      description: `${product.title} е додаден во вашата кошничка.`,
    });
    openCart();
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price-low": {
          const priceA = Number(a.price) || 0;
          const priceB = Number(b.price) || 0;
          return priceA - priceB;
        }
        case "price-high": {
          const priceA = Number(a.price) || 0;
          const priceB = Number(b.price) || 0;
          return priceB - priceA;
        }
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Нашите производи
          </h1>
          <p className="text-lg text-muted-foreground">
            Откријте ги сите наши природни решенија за здравје и убавина
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-muted/20 rounded-lg">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Сортирај по" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Најнови</SelectItem>
              <SelectItem value="name">Име (А-Ш)</SelectItem>
              <SelectItem value="price-low">Цена (ниска-висока)</SelectItem>
              <SelectItem value="price-high">Цена (висока-ниска)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Се вчитува..."
              : sortedProducts.length
              ? `${sortedProducts.length} производи${searchQuery ? ` за "${searchQuery}"` : ""}`
              : searchQuery
              ? `Нема производи за "${searchQuery}"`
              : "Нема достапни производи"}
          </p>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {sortedProducts.map((product) => {
              const primaryImage = product.primary_image_url || product.image || product.image_url || null;
              const originalPriceRaw =
                (product as { original_price?: number | string }).original_price ??
                (product as { compare_at_price?: number | string }).compare_at_price ??
                null;
              const originalPrice = Number(originalPriceRaw) || 0;
              const productPrice = Number(product.price) || 2400;
              const hasDiscount = originalPrice > productPrice;
              const discountPercentage = hasDiscount
                ? Math.round(((originalPrice - productPrice) / originalPrice) * 100)
                : 0;

              return (
                <Card
                  key={product.id}
                  className="group flex h-full flex-col overflow-hidden border-border/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
                >
                  <div className={viewMode === "grid" ? "aspect-[4/3]" : "aspect-[4/3] lg:aspect-[3/2]"}>
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-primary-light/5 to-primary-light/20">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <div className="mb-2 text-4xl">🌿</div>
                          <p className="text-xs">Слика на производ</p>
                        </div>
                      )}
                      {hasDiscount && (
                        <Badge className="absolute left-4 top-4 bg-destructive text-destructive-foreground shadow-lg">
                          -{discountPercentage}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col gap-4 p-5">
                    <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                      {product.title}
                    </h3>

                    {product.description && (
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-xl font-bold text-primary">{formatMKD(productPrice)}</span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatMKD(originalPrice)}
                          </span>
                        )}
                      </div>

                      <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-wide">
                        Природно
                      </Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3 p-5 pt-0 md:flex-row">
                    <Button
                      className="w-full flex-1 gap-2 bg-primary hover:bg-primary-light"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Во кошничка
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link to={`/products/${product.slug}`}>Детали</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && !isFetching && sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Нема најдено производи
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Пробајте со различен збор за пребарување или проверете дали има достапни производи."
                : "Моментално нема објавени производи. Навратете се повторно."}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}