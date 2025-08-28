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
    title: "Create Your Board",
    desc: "Choose an event type (birthday, wedding, concert, graduation, family gathering, or surprise). Add the celebrated person or star.",
    img: Img1,
  },
  {
    title: "Invite People",
    desc: "Share your board by link, SMS, or email. Control privacy settings. Add co admins if needed.",
    img: Img2,
  },
  {
    title: "Collect Memories",
    desc: "Friends and family add wishes, photos, videos, captions, and even voice notes. Every contribution becomes part of the story.",
    img: Img3,
  },
  {
    title: "Wish + Gift",
    desc: "Contributors can write a heartfelt wish, attach media, and add a gift if they like. Goals update live with fun gift stickers.",
    img: Img4,
  },
  {
    title: "Celebrate & Relive",
    desc: "Surprise boards deliver on a chosen day, while event boards are live and collaborative. Either way, your memories are saved forever.",
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
      <section className="sticky top-0 h-screen flex flex-col items-center justify-center px-[5%] max-[769px]:px-4">
        <h2 className="text-center text-[30px] max-[600px]:text-[24px] font-bold">
          How Zoomerly Works
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center mt-12 max-[600px]:mt-4">
          {/* LEFT IMAGE (desktop) */}
          <div className="col-span-2 flex justify-center max-lg:hidden">
            <Image
              src={steps[activeStep].img}
              alt="Step Image"
              className="rounded-[20px] w-full h-auto object-cover transition-opacity duration-500 ease-in-out"
            />
          </div>

          <div className="col-span-3 max-lg:col-span-1 space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`py-3 transition-all duration-500`}
              >
                <h3
                  className={`font-semibold text-[24px] max-[1200px]:text-[18px] border-l-2 border-[#D9D9D9] pl-3 duration-300 ${index === activeStep ? "text-pink-600 border-pink-600" : "text-gray-700"
                    }`}
                >
                  {step.title}
                </h3>
                <p className="text-gray-600 border-l-2 border-[#D9D9D9] pt-2 pl-3 line-clamp-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowZoomerlyWorks;
