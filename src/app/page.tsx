import Faqs from "@/components/sections/Faqs";
import HowZoomerlyWorks from "@/components/sections/HowZoomerlyWorks";
import OurCommunityBoard from "@/components/sections/OurCommunityBoard";
import StartYourFirstCelebration from "@/components/sections/StartYouFirstCelebration";
import WhyPeopleLove from "@/components/sections/WhyPeopleLoveIt";

export default function Home() {
  return (
    <div>
      <OurCommunityBoard/>
      <WhyPeopleLove />
      <HowZoomerlyWorks />
      <StartYourFirstCelebration />
      <Faqs />
    </div>
  );
}
