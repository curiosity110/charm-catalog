import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-28 flex items-center justify-center text-center overflow-hidden">
      {/* soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-background" />
      <div className="hero-backdrop">
        <div className="hero-blob" />
        <div className="hero-blob" />
        <div className="hero-blob" />
      </div>

      {/* centered content */}
      <ScrollReveal className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-[var(--font-script)]">
          <span className="text-primary">Додатоци во исхраната</span>
          <br />
          <span className="text-muted-foreground">и природни креми</span>
        </h1>

        <ScrollReveal delay={120} className="w-full">
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Внимателно одбрани билни мешавини наменети за зајакнување на
            имунолошкиот систем, балансирање на метаболизмот и природна помош за
            вашата кожа и коса.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={240} className="flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-md hover:shadow-xl transition-all duration-500"
          >
            <Link to="/products">ПРОИЗВОДИ</Link>
          </Button>
        </ScrollReveal>
      </ScrollReveal>
    </section>
  );
}
