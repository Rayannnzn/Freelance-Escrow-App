import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Security } from "@/components/landing/Security";
import { Analytics } from "@/components/landing/Analytics";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#121315] selection:bg-neon/30 selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Security />
      <Analytics />
      <Testimonials />
      <Footer />
    </main>
  );
}
