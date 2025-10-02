import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatEUR } from "@/lib/utils";

// Placeholder data - this will be replaced with real data from the database
const featuredProducts = [
  {
    id: "1",
    title: "Билна мешавина за имунитет",
    image: null,
    oldPrice: 2500,
    currentPrice: 1990,
    slug: "bilna-mesavina-imunitet"
  },
  {
    id: "2", 
    title: "Природен крем за лице",
    image: null,
    oldPrice: 1800,
    currentPrice: 1490,
    slug: "priroden-krem-lice"
  },
  {
    id: "3",
    title: "Серум за коса",
    image: null,
    oldPrice: 2200,
    currentPrice: 1790,
    slug: "serum-kosa"
  },
  {
    id: "4",
    title: "Детокс чај",
    image: null,
    oldPrice: 1500,
    currentPrice: 1190,
    slug: "detoks-caj"
  },
  {
    id: "5",
    title: "Антиоксидантен комплекс",
    image: null,
    oldPrice: 2800,
    currentPrice: 2390,
    slug: "antioksidanten-kompleks"
  },
  {
    id: "6",
    title: "Природно масло за тело",
    image: null,
    oldPrice: 1900,
    currentPrice: 1590,
    slug: "prirodno-maslo-telo"
  }
];

export function FeaturedGrid() {
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
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-lighter/10 to-accent/20 relative overflow-hidden">
                {/* Placeholder for product image */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-light/10">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌿</div>
                    <p className="text-xs text-muted-foreground">Слика на производ</p>
                  </div>
                </div>
                
                {/* Discount badge */}
                <Badge className="absolute top-3 left-3 bg-destructive hover:bg-destructive/90">
                  -{Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100)}%
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  Природен производ со сертифицирани состојки за максимална ефикасност.
                </p>
                
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">
                    {formatEUR(product.currentPrice)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatEUR(product.oldPrice)}
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
          ))}
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