import DifferentBoardCarousel from "@/components/sections/DifferentBoardCarousel";
import Faqs from "@/components/sections/Faqs";
import HeroSection from "@/components/sections/HeroSection";
import HowZoomerlyWorks from "@/components/sections/HowZoomerlyWorks";
import OurCommunityBoard from "@/components/sections/OurCommunityBoard";
import StartYourFirstCelebration from "@/components/sections/StartYouFirstCelebration";
import WhyPeopleLove from "@/components/sections/WhyPeopleLoveIt";
import WhyZoomerlyExists from "@/components/sections/WhyZoomerlyExists";

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <WhyZoomerlyExists/>
      <DifferentBoardCarousel/>
      <OurCommunityBoard/>
      <WhyPeopleLove />
      <HowZoomerlyWorks />
      <StartYourFirstCelebration />
      <Faqs />
    </div>
  );
}
