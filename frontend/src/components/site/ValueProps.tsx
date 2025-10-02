import { Shield, Leaf, Award, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";

const valueProps = [
  {
    icon: Shield,
    title: "100% транспарентност",
    description: "Секој производ има детална декларација за составот и потеклото на состојките."
  },
  {
    icon: Leaf,
    title: "Природни состојки",
    description: "Сите состојки се на природна основа и не содржат штетни хемиски материи."
  },
  {
    icon: Award,
    title: "Сертифицирано",
    description: "Нашите производи се анализирани и сертифицирани од надлежни институции."
  },
  {
    icon: CreditCard,
    title: "Плаќање при испорака",
    description: "Безбедно и удобно плаќање кога ќе го примите вашиот производ."
  }
];

export function ValueProps() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Зошто да не изберете?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Нашите вредности и ангажман кон квалитет и транспарентност
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 group">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 uppercase tracking-wide">
                  {prop.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {prop.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}