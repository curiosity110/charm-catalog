import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContactBlock() {
  return (
    <section className="py-16 bg-gradient-to-b from-accent/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="text-lg text-muted-foreground">
            Секогаш сме тука за вас - за било какви прашања или совети
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[MapPin, Phone, Mail].map((IconComponent, index) => (
            <ScrollReveal key={IconComponent.displayName || index} delay={index * 120}>
              <Card className="text-center hover:shadow-md transition-shadow border-border/50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wide">
                    {index === 0 ? "Адреса" : index === 1 ? "Телефон" : "Е-пошта"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 && (
                      <>
                        ул. Природа бр. 123
                        <br />
                        1000 Скопје, Македонија
                      </>
                    )}
                    {index === 1 && (
                      <a
                        href="tel:+38970123456"
                        className="hover:text-primary transition-colors"
                      >
                        +389 70 123 456
                      </a>
                    )}
                    {index === 2 && (
                      <a
                        href="mailto:info@vitacall.mk"
                        className="hover:text-primary transition-colors"
                      >
                        info@vitacall.mk
                      </a>
                    )}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Social Media */}
        <ScrollReveal className="text-center mt-12">
          <h3 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide">
            Следете не
          </h3>
          <div className="flex justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-primary hover:bg-primary/10"
            >
              <Facebook className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-primary hover:bg-primary/10"
            >
              <Instagram className="w-5 h-5" />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
