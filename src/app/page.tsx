import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import AfterConversationAddBoard from "@/components/sections/AfterConversationAddBoard";
import BecomeZoomerlyAmbassador from "@/components/sections/BecomeZoomerlyAmbassador";
import BehindZoomerlyIsZoiax from "@/components/sections/BehindZoomerlyIsZoiax";
import DifferentBoardCarousel from "@/components/sections/DifferentBoardCarousel";
import Faqs from "@/components/sections/Faqs";
import HeroSection from "@/components/sections/HeroSection";
import HowZoomerlyWorksDesktop from "@/components/sections/HowZoomerlyWorksDesktop";
import HowZoomerlyWorksMobile from "@/components/sections/HowZoomerlyWorksMobile";
import MomentNeedsSupport from "@/components/sections/MomentNeedsSupport";
import OurCommunityBoard from "@/components/sections/OurCommunityBoard";
import SocialConnections from "@/components/sections/SocialConnections";
import StartYourFirstCelebration from "@/components/sections/StartYouFirstCelebration";
import UsedYourWay from "@/components/sections/UsedYourWay";
import WhyPeopleLove from "@/components/sections/WhyPeopleLoveIt";
import WhyWeCreatedZoomerly from "@/components/sections/WhyWeCreatedZoomerly";
import ZoomerlyBegins from "@/components/sections/ZoomerlyBegins";
import ZoomerlyExpands from "@/components/sections/ZoomerlyExpands";

export default function Page() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <WhyWeCreatedZoomerly />
      {/* <DifferentBoardCarousel/> */}
      {/* <OurCommunityBoard/> */}
      {/* <WhyPeopleLove /> */}
      <div className="max-[768px]:hidden">
        <HowZoomerlyWorksDesktop />
      </div>
      <div className="hidden max-[768px]:block">
        <HowZoomerlyWorksMobile />
      </div>
      <SocialConnections />
      <ZoomerlyBegins />
      <ZoomerlyExpands />
      <AfterConversationAddBoard />
      <MomentNeedsSupport />
      <UsedYourWay />
      <BecomeZoomerlyAmbassador />
      <BehindZoomerlyIsZoiax />
      <StartYourFirstCelebration />
      {/* <Faqs /> */}
      <Footer />
    </div>
  );
}
