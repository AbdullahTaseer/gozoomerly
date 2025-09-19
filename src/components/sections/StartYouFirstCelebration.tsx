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
    <section className="px-[5%] max-[768px]:px-0 py-10">
      <div className={`relative rounded-[20px] max-[768px]:rounded-none bg-gradient-to-b from-pink-500 via-pink-400 to-purple-500 text-white text-center px-6 py-12 overflow-hidden`}>

        <Image
          src={Particles}
          alt="Confetti Particles"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        <Image src={Avatar_1} alt="1" className="h-[150px] w-[150px] max-[1140px]:h-[100px] max-[1140px]:w-[100px] absolute top-10 max-[1100px]:top-3 right-10 max-[1100px]:right-3" />
        <Image src={Avatar_2} alt="1" height={60} width={60} className="absolute top-5 left-5" />
        <Image src={Avatar_3} alt="1" height={80} width={80} className="absolute bottom-5 left-5" />

        <h2 className="text-[60px] max-[1210px]:text-[52px] max-[1100px]:text-[40px] max-[1024px]:text-[32px] font-bold mb-4 max-[930px]:mt-14 max-w-[700px] mx-auto">
          Create Your First Board Today
        </h2>

        <p className="max-w-3xl mx-auto text-[22px] leading-relaxed mb-6">
          🎉 It only takes a minute to create a board. Bring people together, share memories, give gifts, and now connect.
        </p>

        <div className="mb-16 flex justify-center max-[520px]:flex-col items-center gap-6">
          <div className="w-[350px] max-[520px]:w-full">
            <GlobalButton title='Create Your Board' height="46px" bgColor="white" color="black" width="100%" className="mx-auto" hover={{ bgColor: 'white' }} />
          </div>
          <div className="w-[350px] max-[520px]:w-full hidden max-[768px]:block">
            <GlobalButton title='Watch a Real Board' height="46px" bgColor="transparent" width="100%" borderColor="white" borderWidth="1px" className="mx-auto" hover={{ bgColor: 'transparent' }} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default StartYourFirstCelebration;