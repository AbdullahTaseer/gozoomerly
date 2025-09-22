"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import TitleCard from "../cards/TitleCard";
import { steps } from "@/lib/MockData";


const HowZoomerlyWorksDesktop = () => {
  const [activeStep, setActiveStep] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;

      // wrapper ke document me absolute start/end
      const start = el.offsetTop;
      const totalScrollable = el.offsetHeight - window.innerHeight;

      // agar wrapper ki height screen se chhoti ho to first step par hi raho
      if (totalScrollable <= 0) {
        setActiveStep(0);
        return;
      }

      // current scroll ko wrapper ki range me clamp karo
      const y = Math.min(Math.max(window.scrollY, start), start + totalScrollable);

      // 0..1 progress
      const progress = (y - start) / totalScrollable;

      // progress ko 0..(steps-1) me map karo
      const idx = Math.min(
        Math.floor(progress * steps.length), // 0 inclusive, last exclusive
        steps.length - 1
      );

      setActiveStep(idx);
    };

    // initial call taake first step immediately active rahe
    onScroll();

    // passive for perf, resize par bhi recalc
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (

    <div className="bg-gray-50 py-10 mt-5">
      <TitleCard title="How Zoomerly Works" />

      <div
        ref={wrapRef}
        className="relative "
        style={{ height: `${steps.length * 200}vh` }}
      >
        <section className="sticky top-0 min-h-screen flex flex-col items-center justify-center px-[5%] max-[769px]:px-4">

          <div className="grid w-full max-[768px]:grid-cols-1 max-[1024px]:grid-cols-2 grid-cols-5 gap-8 items-center mt-12 max-[600px]:mt-4">

            <div className="col-span-2 flex justify-center max-lg:col-span-1">
              <Image
                src={steps[activeStep].img}
                alt="Step Image"
                className="rounded-[20px] w-full h-full max-[768px]:h-[60vh] object-cover transition-opacity duration-500 ease-in-out"
              />
            </div>


            <div className="col-span-3 max-lg:col-span-1 space-y-2 max-[768px]:space-y-0">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="py-2 h-full flex max-[1024px]:py-1 transition-all duration-500"
                >

                  <div className="w-[2px] shrink-0 rounded-full bg-gray-300 relative">
                    {index === activeStep && (
                      <div className="absolute top-0 w-full h-1/2 bg-pink-600 rounded-full" />
                    )}
                  </div>

                  <div className="pl-4">
                    <p className="bg-[#EBEBEB] rounded-full font-semibold inline text-[12px] px-3 py-[2px]">Step {step.number}</p>
                    <h3 className={`font-semibold text-[24px] max-[1200px]:text-[18px] pt-1 duration-300 ${index === activeStep ? "bg-gradient-to-r from-[#EA4088] to-[#885CB8] text-transparent bg-clip-text" : "text-gray-700"}`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-600 pt-2 line-clamp-2 max-md:text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowZoomerlyWorksDesktop;
