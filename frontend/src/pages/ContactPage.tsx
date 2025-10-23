import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ContactBlock } from "@/components/site/ContactBlock";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="py-16">
          <ScrollReveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Контактирајте го тимот на Vita Call
            </h1>
            <p className="text-lg text-muted-foreground">
              Имаме отворена комуникација со нашите клиенти. Пополнете ја
              формата и ќе ви одговориме во рок од 24 часа.
            </p>
          </ScrollReveal>
        </section>

        <section className="py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-[2fr,3fr]">
            <ScrollReveal>
              <Card className="border-border/60 h-full">
                <CardContent className="p-6 space-y-4 text-left">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Работно време
                  </h2>
                  <p className="text-muted-foreground">
                    Понеделник - Петок: 09:00 - 18:00
                  <br />
                  Сабота: 10:00 - 14:00
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Адреса на шоурум
                  </h3>
                  <p className="text-muted-foreground">
                    Ул. Природа бр. 123
                    <br />
                    1000 Скопје, Македонија
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Телефон
                  </h3>
                  <p>
                    <a
                      href="tel:+38970123456"
                      className="text-primary hover:text-primary-light"
                    >
                      +389 70 123 456
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Е-пошта
                  </h3>
                    <p>
                      <a
                        href="mailto:info@naturalcharm.mk"
                        className="text-primary hover:text-primary-light"
                      >
                        info@naturalcharm.mk
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-foreground"
                      >
                        Име и презиме
                      </label>
                      <Input
                        id="contact-name"
                        placeholder="Вашето име"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-foreground"
                      >
                        Е-пошта
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="contact@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-medium text-foreground"
                    >
                      Телефон
                    </label>
                    <Input id="contact-phone" placeholder="07X XXX XXX" />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-foreground"
                    >
                      Порака
                    </label>
                    <Textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Напишете ја вашата порака"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-light transition-colors duration-300"
                  >
                    Испрати порака
                  </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        <ContactBlock />
      </main>
      <Footer />
    </div>
  );
}
