import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import DifferentBoardCarousel from "@/components/sections/DifferentBoardCarousel";
import Faqs from "@/components/sections/Faqs";
import HeroSection from "@/components/sections/HeroSection";
import HowZoomerlyWorks from "@/components/sections/HowZoomerlyWorks";
import OurCommunityBoard from "@/components/sections/OurCommunityBoard";
import SocialConnections from "@/components/sections/SocialConnections";
import StartYourFirstCelebration from "@/components/sections/StartYouFirstCelebration";
import WhyPeopleLove from "@/components/sections/WhyPeopleLoveIt";
import WhyZoomerlyExists from "@/components/sections/WhyZoomerlyExists";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <WhyZoomerlyExists/>
      <DifferentBoardCarousel/>
      <OurCommunityBoard/>
      <WhyPeopleLove />
      <HowZoomerlyWorks />
      <SocialConnections/>
      <StartYourFirstCelebration />
      <Faqs />
      <Footer/>
    </div>
  );
}
