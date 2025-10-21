import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VitaCall_Logo from "@/assets/Vita_Call_Logo.png";

export function Hero() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-background -z-10" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* LOGO behind heading */}
        <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none select-none z-0">
          {/* <img
            src={VitaCall_Logo}
            alt="Vita Call Logo"
            className="
              w-[72%] max-w-[720px]
              opacity-25
              blur-[0.4px]
              -translate-y-1
              mask-fade-bottom
            "
          /> */}
        </div>

        {/* Content (on top) */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-[var(--font-script)] leading-tight">
            <span className="text-primary relative">Додатоци во исхраната</span>
            <br />
            <span className="text-muted-foreground">и природни креми</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Внимателно одбрани билни мешавини наменети за зајакнување на
            имунолошкиот систем, балансирање на метаболизмот и природна помош за
            вашата кожа и коса.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link to="/products">НАШИТЕ ПРОИЗВОДИ</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link to="/about">ЗА НАС</Link>
            </Button>
          </div>

          {/* Small banner */}
          <div className="relative w-full mt-8">
            <div className="relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-r from-primary/20 to-accent/30 h-24 flex items-center justify-center">
              <div className="text-primary font-medium tracking-wide flex items-center gap-3">
                <span className="text-2xl">🌿</span>
                <span className="text-base md:text-lg">
                  Природни состојки • Квалитет &amp; доверба
                </span>
              </div>
            </div>
            <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-primary/5 -z-10" />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full bg-primary-light/5 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
