import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { ValueProps } from "@/components/site/ValueProps";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { StatsBand } from "@/components/site/StatsBand";
import { ContactBlock } from "@/components/site/ContactBlock";
import { Footer } from "@/components/site/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <FeaturedGrid />
        <StatsBand />
        <ContactBlock />
      </main>
      <Footer />
    </div>
  );
}