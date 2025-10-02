import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContactBlock() {
  return (
    <section className="py-16 bg-gradient-to-b from-accent/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Контактирајте не
          </h2>
          <p className="text-lg text-muted-foreground">
            Секогаш сме тука за вас - за било какви прашања или совети
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Address */}
          <Card className="text-center hover:shadow-md transition-shadow border-border/50">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wide">Адреса</h3>
              <p className="text-sm text-muted-foreground">
                ул. Природа бр. 123<br />
                1000 Скопје, Македонија
              </p>
            </CardContent>
          </Card>

          {/* Phone */}
          <Card className="text-center hover:shadow-md transition-shadow border-border/50">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wide">Телефон</h3>
              <p className="text-sm text-muted-foreground">
                <a href="tel:+38970123456" className="hover:text-primary transition-colors">
                  +389 70 123 456
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="text-center hover:shadow-md transition-shadow border-border/50">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wide">Е-пошта</h3>
              <p className="text-sm text-muted-foreground">
                <a href="mailto:info@naturalcharm.mk" className="hover:text-primary transition-colors">
                  info@naturalcharm.mk
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Social Media */}
        <div className="text-center mt-12">
          <h3 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide">
            Следете не
          </h3>
          <div className="flex justify-center space-x-4">
            <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
              <Facebook className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
              <Instagram className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}