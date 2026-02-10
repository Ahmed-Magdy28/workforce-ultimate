import { FeaturesSection } from '@/components/common/FeaturesSection';
import { HeroSection } from '../../components/common/HeroSection';
import { PricingSection } from '@/components/common/PricingSection';
import { TechStackSection } from '@/components/common/TechStackSection';
import LandingPageSeo from '@/components/common/LandingPageSeo';

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
