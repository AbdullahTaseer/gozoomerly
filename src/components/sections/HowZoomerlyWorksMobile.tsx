"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import TitleCard from "../cards/TitleCard";
import { steps } from "@/lib/MockData";

const HowZoomerlyWorksMobile = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActiveStep(idx);
          }
        });
      },
      {
        root: null,
        threshold: 0.6,
      }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-gray-50 py-10 mt-5">
      <TitleCard title="How Zoomerly Works" />

      <div className="mt-6">
        <div className="flex justify-center p-4 mb-6">
          <Image
            src={steps[activeStep].img}
            alt="Active Step"
            className="rounded-[20px] w-sm h-[55vh] object-cover transition-all duration-500"
          />
        </div>

        <div className="flex overflow-x-scroll space-x-4 px-4 scrollbar-hide snap-x snap-mandatory">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-index={index}
              className="py-2 shrink-0 w-[80%] flex transition-all duration-500 snap-center"
            >
              <div className="w-[2px] rounded-full bg-gray-300 relative">
                {index === activeStep && (
                  <div className="absolute top-0 w-full h-1/2 bg-pink-600 rounded-full" />
                )}
              </div>

              <div className="pl-4">
                <p className="bg-[#EBEBEB] rounded-full font-semibold inline text-[12px] px-3 py-[2px]">
                  Step {step.number}
                </p>
                <h3
                  className={`font-semibold text-[20px] pt-1 ${index === activeStep
                      ? "bg-gradient-to-r from-[#EA4088] to-[#885CB8] text-transparent bg-clip-text"
                      : "text-gray-700"
                    }`}
                >
                  {step.title}
                </h3>
                <p className="text-gray-600 pt-2 text-sm line-clamp-2">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowZoomerlyWorksMobile;