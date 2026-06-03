import { SmoothScroll } from "@/components/Custom/landing/SmoothScroll";
import { LandingNavbar } from "@/components/Custom/landing/LandingNavbar";
import { HeroSection } from "@/components/Custom/landing/HeroSection";
import { FeaturesSection } from "@/components/Custom/landing/FeaturesSection";
import { WhyFreeSection } from "@/components/Custom/landing/WhyFreeSection";
import { MicroSaasSection } from "@/components/Custom/landing/MicroSaasSection";
import { UseCasesSection } from "@/components/Custom/landing/UseCasesSection";
import { DeployCtaSection } from "@/components/Custom/landing/DeployCtaSection";
import { LandingFooter } from "@/components/Custom/landing/LandingFooter";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <LandingNavbar />
        <HeroSection />
        <FeaturesSection />
        <WhyFreeSection />
        <MicroSaasSection />
        <UseCasesSection />

        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
