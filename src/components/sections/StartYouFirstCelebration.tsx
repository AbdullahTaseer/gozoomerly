"use client";

import React from "react";
import Image from "next/image";

import GlobalButton from "../buttons/GlobalButton";

import Avatar_1 from "@/assets/svgs/start-celebration-avatar-1.svg";
import Avatar_2 from "@/assets/svgs/start-celebration-avatar-2.svg";
import Avatar_3 from "@/assets/svgs/start-celebration-avatar-3.svg";
import Particles from "@/assets/svgs/start-you-first-celebration.svg";

const StartYourFirstCelebration = () => {

  return (
    <section className="px-[5%] max-[769px]:px-4 py-10">
      <div className={`relative rounded-[20px] bg-gradient-to-b from-pink-500 via-pink-400 to-purple-500 text-white text-center px-6 py-12 overflow-hidden`}>

        <Image
          src={Particles}
          alt="Confetti Particles"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        <Image src={Avatar_1} alt="1" className="h-[150px] w-[150px] max-[1140px]:h-[100px] max-[1140px]:w-[100px] absolute top-10 max-[1100px]:top-3 right-10 max-[1100px]:right-3" />
        <Image src={Avatar_2} alt="1" height={60} width={60} className="absolute top-5 left-5" />
        <Image src={Avatar_3} alt="1" height={80} width={80} className="absolute bottom-5 left-5" />

        <h2 className="text-[60px] max-[1210px]:text-[52px] max-[1100px]:text-[40px] max-[1024px]:text-[32px] max-[600px]:text-[24px] font-bold mb-4 max-[930px]:mt-14 max-w-[700px] mx-auto">
          Create Your First Board Today
        </h2>

        <p className="max-w-3xl mx-auto text-[20px] leading-relaxed mb-6">
          🎉 It only takes a minute to create a board. Bring people together, share memories, give gifts, and now connect.
        </p>

        {/* <div className="flex flex-wrap justify-center gap-4 mb-16">
          <GlobalButton title="Explore Spotlight Birthdays" bgColor="white" color="#000000" width="220px" hover={{ bgColor: 'white' }} />
          <GlobalButton title="Create a Public Birthday Board" bgColor="transparent" borderColor="white" borderWidth="1px" width="220px" hover={{ bgColor: 'transparent' }} />
        </div> */}

        <GlobalButton title='Create Your Board' bgColor="white" color="black" width="200px" className="mx-auto  mb-16" hover={{ bgColor: 'white' }} />
      </div>
    </section>
  );
};

export default StartYourFirstCelebration;