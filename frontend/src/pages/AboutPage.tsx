import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const milestones = [
  {
    year: "2015",
    title: "Почеток на Natural Charm",
    description:
      "Започнавме како мала занаетчиска работилница за природна козметика и чаеви инспирирани од македонската природа.",
  },
  {
    year: "2018",
    title: "Лансирање на првата линија",
    description: "Нашата линија за нега на кожа освои локални награди и стана омилена во билјарниците низ државата.",
  },
  {
    year: "2021",
    title: "Проширување на производството",
    description: "Го проширивме тимот со фитотерапевти и фармацевти за да обезбедиме сертифицирана природна козметика.",
  },
];

const values = [
  {
    title: "Чисти природни состојки",
    description:
      "Користиме внимателно селектирани билки и масла од локални производители без вештачки адитиви и парабени.",
  },
  {
    title: "Рачна изработка",
    description: "Секој производ е рачно изработен во мали серии за максимална свежина и квалитет.",
  },
  {
    title: "Етичко производство",
    description: "Соработуваме со одговорни добавувачи и се грижиме за одржливи процеси на производство.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-accent/20 to-background py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <Badge variant="secondary" className="uppercase tracking-wide text-primary">Нашата приказна</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              Посветени на природна нега и автентична убавина
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Natural Charm создава производи инспирирани од природата со нежни формули кои ја поддржуваат
              вашата природна убавина и благосостојба. Нашата мисија е да внесеме моменти на грижа и радост
              во секојдневните ритуали.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold">Нашиот пристап</h2>
              <p className="text-muted-foreground leading-relaxed">
                Секој наш производ започнува со рецепт развиен од експерти за фитотерапија и природна козметологија.
                Веруваме во моќта на локалната флора и внимателно ги избираме состојките со познато потекло.
                Производството се одвива во сертифицирана лабораторија каде што секоја серија поминува низ строги
                контроли на квалитет.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Нашата цел е да создадеме производи кои се безбедни и ефикасни за целото семејство. Постојано
                инвестираме во истражување и развој за да понудиме нови решенија засновани на современи научни
                сознанија и традиционални рецепти.
              </p>
            </div>

            <div className="grid gap-4">
              {values.map((value) => (
                <Card key={value.title} className="border-border/60">
                  <CardContent className="p-6 space-y-2 text-left">
                    <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">Клучни моменти</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {milestones.map((milestone) => (
                <Card key={milestone.year} className="border-border/60 text-center">
                  <CardContent className="p-6 space-y-3">
                    <span className="text-sm font-semibold uppercase tracking-wide text-primary">{milestone.year}</span>
                    <h3 className="text-xl font-semibold">{milestone.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
