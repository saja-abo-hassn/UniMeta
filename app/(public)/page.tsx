import { LandingHeader } from "./components/landing-header";
import { LandingHero } from "./components/landing-hero";
import { InterestsQuizCard } from "./components/interests-quiz-card";
import { WhyUnimetaSection } from "./components/why-unimeta-section";
import { FeaturesSection } from "./components/features-section";
import { AboutSection } from "./components/about-section";
import { TeamSection } from "./components/team-section";
import { CtaBanner } from "./components/cta-banner";
import { LandingFooter } from "./components/landing-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0F6FA] text-[#0B192C] font-sans selection:bg-brand-primary selection:text-white">
      <LandingHeader />
      <LandingHero />
      <InterestsQuizCard />
      <WhyUnimetaSection />
      <FeaturesSection />
      <AboutSection />
      <TeamSection />
      <CtaBanner />
      <LandingFooter />
    </div>
  );
}
