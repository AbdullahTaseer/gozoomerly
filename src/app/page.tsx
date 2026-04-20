import dynamic from "next/dynamic";
import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import {
  SkeletonLandingSection,
  Skeleton,
} from "@/components/skeletons";

const LandingSectionSkeleton = () => (
  <SkeletonLandingSection minHeightPx={256} />
);

const WhyWeCreatedZoomerly = dynamic(
  () => import("@/components/sections/WhyWeCreatedZoomerly"),
  { loading: () => <LandingSectionSkeleton /> }
);

const HowZoomerlyWorksResponsive = dynamic(
  () => import("@/components/sections/HowZoomerlyWorksResponsive"),
  { loading: () => <LandingSectionSkeleton /> }
);

const SocialConnections = dynamic(
  () => import("@/components/sections/SocialConnections"),
  { loading: () => <LandingSectionSkeleton /> }
);

const ZoomerlyBegins = dynamic(
  () => import("@/components/sections/ZoomerlyBegins"),
  { loading: () => <LandingSectionSkeleton /> }
);

const ZoomerlyExpands = dynamic(
  () => import("@/components/sections/ZoomerlyExpands"),
  { loading: () => <LandingSectionSkeleton /> }
);

const AfterConversationAddBoard = dynamic(
  () => import("@/components/sections/AfterConversationAddBoard"),
  { loading: () => <LandingSectionSkeleton /> }
);

const MomentNeedsSupport = dynamic(
  () => import("@/components/sections/MomentNeedsSupport"),
  { loading: () => <LandingSectionSkeleton /> }
);

const UsedYourWay = dynamic(
  () => import("@/components/sections/UsedYourWay"),
  { loading: () => <LandingSectionSkeleton /> }
);

const BecomeZoomerlyAmbassador = dynamic(
  () => import("@/components/sections/BecomeZoomerlyAmbassador"),
  { loading: () => <LandingSectionSkeleton /> }
);

const BehindZoomerlyIsZoiax = dynamic(
  () => import("@/components/sections/BehindZoomerlyIsZoiax"),
  { loading: () => <LandingSectionSkeleton /> }
);

const StartYourFirstCelebration = dynamic(
  () => import("@/components/sections/StartYouFirstCelebration"),
  { loading: () => <LandingSectionSkeleton /> }
);

const Footer = dynamic(() => import("@/components/footer/Footer"), {
  loading: () => (
    <Skeleton className="mt-8 h-24 w-full rounded-none bg-neutral-900/10" />
  ),
});

export default function Page() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <WhyWeCreatedZoomerly />
      {/* <DifferentBoardCarousel/> */}
      {/* <OurCommunityBoard/> */}
      {/* <WhyPeopleLove /> */}
      <HowZoomerlyWorksResponsive />
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
