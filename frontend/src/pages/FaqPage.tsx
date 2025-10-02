import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "Како се користат вашите производи за нега на кожа?",
    answer:
      "Секој производ доаѓа со детални упатства. Препорачуваме чистење на кожата, нанесување на тоник, а потоа користење на серум и крем според вашите потреби.",
  },
  {
    question: "Дали производите се безбедни за чувствителна кожа?",
    answer:
      "Да, нашите формули се хипоалергени и дерматолошки тестирани. Сепак, препорачуваме тест на мал дел од кожата доколку имате алергии.",
  },
  {
    question: "Колку време е потребно за испорака?",
    answer:
      "Нарачките се обработуваат во рок од 24 часа, а доставата обично трае 1-3 работни дена зависно од градот.",
  },
  {
    question: "Дали нудите можност за нарачка на големо?",
    answer:
      "Да, контактирајте нè за персонализирана понуда и информации за соработка со продавници и спа центри.",
  },
  {
    question: "Кои методи за плаќање ги прифаќате?",
    answer:
      "Моментално плаќањето се врши при достава или преку уплата на трансакциска сметка по договор.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="uppercase tracking-wide text-primary border-primary">
              Прашања и одговори
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Најчесто поставувани прашања</h1>
            <p className="text-lg text-muted-foreground">
              Ги собравме најчестите прашања од нашите клиенти. Доколку ви треба дополнителна информација,
              контактирајте нè во секое време.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`} className="border border-border/70 rounded-lg px-4">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
