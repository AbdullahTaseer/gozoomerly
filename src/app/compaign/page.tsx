"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { compaignMainScreenData } from "@/lib/MockData";

import AppLogo from "@/assets/svgs/Zoomerly.svg";
import Particles from "@/assets/svgs/why-people-love-particles.svg";


const Compaign = () => {

  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white p-6">

      <Image onClick={() => router.push("/")} src={AppLogo} alt="App Logo" className="cursor-pointer relative z-10" />
      <Image src={Particles} alt="" className="absolute top-10 left-10" />
      <Image src={Particles} alt="" className="absolute bottom-10 right-10" />

      <h2 className="mt-4 sm:mt-12 text-center text-[32px] max-[700px]:text-[24px] font-bold">
        What Are You Celebrating?
      </h2>

      <div className="mt-4 sm:mt-10 relative z-1 grid max-[520px]:grid-cols-1 max-[768px]:grid-cols-2 max-[1024px]:grid-cols-3 grid-cols-4 gap-6 w-full mx-auto max-w-6xl">
        {compaignMainScreenData.map((item, i) => (
          <div
            key={i}
            onClick={() => item.path && router.push(item.path)}
            className="bg-black rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="relative w-full h-[180px]">
              <Image src={item.imgSrc} alt={item.text} fill className="object-cover" />
            </div>
            <p className="p-3 text-white text-center font-bold">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compaign;