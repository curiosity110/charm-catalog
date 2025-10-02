import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-background"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-[var(--font-script)]">
              <span className="text-primary">Додатоци во исхраната</span>
              <br />
              <span className="text-muted-foreground">и природни креми</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Внимателно одбрани билни мешавини наменети за зајакнување на имунолошкиот систем, 
              балансирање на метаболизмот и природна помош за вашата кожа и коса.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-md hover:shadow-lg transition-all duration-300">
                <Link to="/products">НАШИТЕ ПРОИЗВОДИ</Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/about">ЗА НАС</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-primary-lighter/20 to-accent/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-primary-lighter/10 to-primary/10 flex items-center justify-center">
                  <div className="text-center text-primary">
                    <div className="text-6xl mb-4">🌿</div>
                    <p className="text-lg font-medium">Природни состојки</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🍃</span>
              </div>
              <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary/5 -z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-primary-light/5 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}