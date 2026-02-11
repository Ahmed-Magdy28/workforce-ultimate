import { FeaturesSection } from '@/components/common/LandingPage/FeaturesSection';
import { HeroSection } from '../../components/common/LandingPage/HeroSection';
import { PricingSection } from '@/components/common/LandingPage/PricingSection';
import { TechStackSection } from '@/components/common/LandingPage/TechStackSection';
import LandingPageSeo from '@/components/common/LandingPage/LandingPageSeo';

export default function LandingPage() {
   return (
      <>
         <LandingPageSeo />
         <HeroSection />
         <FeaturesSection />
         <PricingSection />
         <TechStackSection />
      </>
   );
}
