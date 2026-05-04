import Hero from "@/components/marketing/Hero";
import Servicios from "@/components/marketing/Services";
import SobreMi from "@/components/marketing/AboutMe";
import ComoFunciona from "@/components/marketing/HowItWorks";
import Plataforma from "@/components/marketing/Platform";
import CTA from "@/components/marketing/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Servicios />
      <SobreMi />
      <ComoFunciona />
      <Plataforma />
      <CTA />
    </main>
  );
}