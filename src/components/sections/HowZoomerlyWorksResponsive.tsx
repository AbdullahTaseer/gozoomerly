"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

function WorksSkeleton() {
  return (
    <div
      className="min-h-[400px] w-full animate-pulse rounded-2xl bg-neutral-100/70"
      aria-hidden
    />
  );
}

const HowZoomerlyWorksDesktop = dynamic(
  () => import("@/components/sections/HowZoomerlyWorksDesktop"),
  { loading: () => <WorksSkeleton /> }
);

const HowZoomerlyWorksMobile = dynamic(
  () => import("@/components/sections/HowZoomerlyWorksMobile"),
  { loading: () => <WorksSkeleton /> }
);

export default function HowZoomerlyWorksResponsive() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (isMobile === null) {
    return <WorksSkeleton />;
  }

  return isMobile ? <HowZoomerlyWorksMobile /> : <HowZoomerlyWorksDesktop />;
}
