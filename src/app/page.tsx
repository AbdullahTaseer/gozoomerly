import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import DifferentBoardCarousel from "@/components/sections/DifferentBoardCarousel";
import Faqs from "@/components/sections/Faqs";
import HeroSection from "@/components/sections/HeroSection";
import HowZoomerlyWorksDesktop from "@/components/sections/HowZoomerlyWorksDesktop";
import HowZoomerlyWorksMobile from "@/components/sections/HowZoomerlyWorksMobile";
import OurCommunityBoard from "@/components/sections/OurCommunityBoard";
import SocialConnections from "@/components/sections/SocialConnections";
import StartYourFirstCelebration from "@/components/sections/StartYouFirstCelebration";
import WhyPeopleLove from "@/components/sections/WhyPeopleLoveIt";
import WhyWeCreatedZoomerly from "@/components/sections/WhyWeCreatedZoomerly";

export default function Page() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <WhyWeCreatedZoomerly/>
      <DifferentBoardCarousel/>
      <OurCommunityBoard/>
      <WhyPeopleLove />
      <div className="max-[768px]:hidden">
      <HowZoomerlyWorksDesktop />
      </div>
      <div className="hidden max-[768px]:block">
        <HowZoomerlyWorksMobile/>
      </div>
      <SocialConnections/>
      <StartYourFirstCelebration />
      <Faqs />
      <Footer/>
    </div>
  );
}
