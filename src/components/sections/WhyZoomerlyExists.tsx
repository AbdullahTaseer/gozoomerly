"use client";
import React from "react";
import Image from "next/image";

import Particles from "@/assets/svgs/why-people-love-particles.svg";

import problem_1 from "@/assets/svgs/problem-icon-1.svg";
import problem_2 from "@/assets/svgs/problem-icon-2.svg";
import problem_3 from "@/assets/svgs/problem-icon-3.svg"

import solve_1 from "@/assets/svgs/solves-icon-1.svg";
import solve_2 from "@/assets/svgs/solves-icon-2.svg";
import solve_3 from "@/assets/svgs/solves-icon-3.svg";

import theProblemText from "@/assets/svgs/The Problems.svg";
import SolutionText from "@/assets/svgs/Zoomerly solves all of this.svg";

const problems = [
  {
    icon: problem_1,
    title: "Memories get lost across chats, feeds, and phones.",
    desc: "Important moments scattered across different platforms",
  },
  {
    icon: problem_2,
    title: "Guests often never get to connect after events.",
    desc: "Missing opportunities to build lasting relationships",
  },
  {
    icon: problem_3,
    title: "Gifting feels transactional instead of meaningful.",
    desc: "Gifts lack personal connection and context",
  },
];

const solutions = [
  {
    icon: solve_1,
    title: "One shared space for wishes, photos, videos, and gifts.",
    desc: "Everything in one beautiful, organized place",
  },
  {
    icon: solve_2,
    title:
      "A social layer so people at the same event can connect, follow, and message each other.",
    desc: "Missing opportunities to build lasting relationships",
  },
  {
    icon: solve_3,
    title: "Boards that last forever, so celebrations never fade away.",
    desc: "Preserve precious memories for generations",
  },
];

const WhyWeCreatedZoomerly = () => {
  return (
    <section className="px-[5%] max-[769px]:px-4 py-16 relative">

      <Image src={Particles} alt="particles" className='absolute bottom-28 right-0' />

      <h2 className="text-center text-[42px] max-[900px]:text-[30px] max-[600px]:text-[24px] font-bold">
        Why We Created Zoomerly
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mt-12 relative">

        <div>

          <Image src={theProblemText} alt="" className="h-6" />

          <div className="space-y-6 mt-6">
            {problems.map((item, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl p-4 flex gap-3 items-start"
              >
                <div className="flex-shrink-0 h-[45px] w-[45px] flex justify-center items-center rounded-full bg-white">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={22}
                    height={22}
                  />
                </div>
                <div>
                  <p className="font-semibold text-[20px] max-[900px]:text-[18px]">
                    {item.title}
                  </p>
                  <p className="text-gray-600 mt-1 max-[900px]:text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>

          <Image src={SolutionText} alt="" className="h-8" />

          <div className="space-y-6 mt-4">
            {solutions.map((item, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl p-4 flex gap-3 items-start"
              >
                <div className="flex-shrink-0 h-[45px] w-[45px] flex justify-center items-center rounded-full bg-white">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={22}
                    height={22}
                  />
                </div>
                <div>
                  <p className="font-semibold text-[20px] max-[900px]:text-[18px]">
                    {item.title}
                  </p>
                  <p className="text-gray-600 mt-1 max-[900px]:text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeCreatedZoomerly;
