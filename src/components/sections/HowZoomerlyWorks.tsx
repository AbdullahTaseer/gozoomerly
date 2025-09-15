"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import Img1 from "@/assets/svgs/as-simple-as-wishing.svg";
import Img2 from "@/assets/svgs/as-simple-as-wishing-2.svg";
import Img3 from "@/assets/svgs/as-simple-as-wishing-3.svg";
import Img4 from "@/assets/svgs/as-simple-as-wishing-4.svg";
import Img5 from "@/assets/svgs/as-simple-as-wishing-5.svg";

const steps = [
  {
    number: '01',
    title: "Create Your Board",
    desc: "Pick the event type and add the celebrated star.",
    img: Img1,
  },
  {
    number: '02',
    title: "Invite People",
    desc: "Share the link by SMS, email, or QR. Control privacy.",
    img: Img2,
  },
  {
    number: '03',
    title: "Collect Memories",
    desc: "Guests post wishes, media, and comments.",
    img: Img3,
  },
  {
    number: '04',
    title: "Wish + Gift",
    desc: "Contributors send meaningful gifts alongside their messages.",
    img: Img4,
  },
  {
    number: '05',
    title: "Celebrate & Relive",
    desc: "Surprise boards deliver on the big day; event boards stay live and collaborative.",
    img: Img5,
  },
];

const HowZoomerlyWorks = () => {
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
    // Har step ke liye ~200vh scroll space (responsive). Chaho to 150/250 kar sakte ho.
    <div
      ref={wrapRef}
      className="relative bg-gray-50 py-10"
      style={{ height: `${steps.length * 200}vh` }}
    >
      <section className="sticky top-0 min-h-screen flex flex-col items-center justify-center px-[5%] max-[769px]:px-4">
        <h2 className="text-center text-[42px] max-[900px]:text-[30px] max-[600px]:text-[24px] font-bold">
          How Zoomerly Works
        </h2>

        <div className="grid w-full max-[700px]:grid-cols-1 max-[1024px]:grid-cols-2 grid-cols-5 gap-8 items-center mt-12 max-[600px]:mt-4">

          <div className="col-span-2 flex justify-center max-lg:col-span-1">
            <Image
              src={steps[activeStep].img}
              alt="Step Image"
              className="rounded-[20px] w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            />
          </div>


          <div className="col-span-3 max-lg:col-span-1 space-y-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`py-2 max-[1024px]:py-1 transition-all duration-500`}
              >
                <div className={`border-l-2 pl-4 ${index === activeStep ? "border-pink-600" : ""}`}>
                  <p className="bg-[#EBEBEB] rounded-full font-semibold inline text-[12px] px-3 py-[2px]">Step {step.number}</p>
                </div>
                <h3 className={`font-semibold text-[24px] max-[1200px]:text-[18px] border-l-2 pt-1 border-[#D9D9D9] pl-4 duration-300 ${index === activeStep ? "bg-gradient-to-r from-[#EA4088] to-[#885CB8] border-pink-600 text-transparent bg-clip-text" : "text-gray-700"}`}>
                  {step.title}
                </h3>
                <p className="text-gray-600 border-l-2 border-[#D9D9D9] pt-2 pl-4 line-clamp-2 max-md:text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowZoomerlyWorks;
