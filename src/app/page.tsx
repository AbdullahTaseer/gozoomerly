import dynamic from "next/dynamic";
import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/sections/HeroSection";

function LandingSectionSkeleton() {
  return (
    <div className="w-full py-12 md:py-16" aria-hidden>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-neutral-200/80" />
        <div className="mb-4 h-4 max-w-2xl animate-pulse rounded bg-neutral-100" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-neutral-100/80" />
      </div>
    </div>
  );
}

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
    <div
      className="mt-8 h-24 w-full animate-pulse bg-neutral-900/10"
      aria-hidden
    />
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
