"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import TitleCard from '../cards/TitleCard';
import UserWay1 from "@/assets/pngs/used-way-1.png";
import UserWay2 from "@/assets/pngs/used-way-2.png";

const mobileScreenshots = [
  UserWay1,
  UserWay2,
  UserWay1,
  UserWay2,
  UserWay1,
  UserWay2,
  UserWay1,
  UserWay2,
  UserWay1,
  UserWay2,
];

const features = [
  "Use it just as a messenger",
  "Use it socially",
  "Create boards for life moments",
  "Book services when needed"
];

const UsedYourWay = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [lastClicked, setLastClicked] = useState<'left' | 'right' | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
      setLastClicked('left');
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
      setLastClicked('right');
    }
  };

  return (
    <section className="py-16 pl-[5%] max-[900px]:pl-0">
      <div className="grid grid-cols-3 max-[900px]:grid-cols-1 gap-12 max-[900px]:gap-8 items-center">
        <div className="max-[900px]:order-1 max-[900px]:pl-[5%] max-[768px]:pl-4">
          <TitleCard title="One App. Used Your Way." className="text-left mb-4" />
          <p className="text-gray-500 text-lg max-[900px]:text-base max-[768px]:text-sm mb-8">
            Zoomerly adapts to what you want.
          </p>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-black/60" />
                <p className="text-gray-800 text-lg max-[900px]:text-base max-[768px]:text-sm">
                  {feature}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 max-[900px]:hidden">
            <button
              onClick={scrollLeft}
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${lastClicked === 'left'
                ? 'bg-gradient-to-r from-[#EA4088] to-[#885CB8] hover:opacity-90'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className={`w-6 h-6 ${lastClicked === 'left' ? 'text-white' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={scrollRight}
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${lastClicked === 'right'
                ? 'bg-gradient-to-r from-[#EA4088] to-[#885CB8] hover:opacity-90'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
              aria-label="Scroll right"
            >
              <ChevronRight className={`w-6 h-6 ${lastClicked === 'right' ? 'text-white' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-col max-[900px]:order-2 col-span-2">
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto scrollbar-hide max-[768px]:px-4"
          >
            <div className="flex gap-6 max-[768px]:gap-4">
              {mobileScreenshots.map((screenshot, index) => (
                <div key={index} className="relative flex-shrink-0 w-[280px] max-[768px]:w-[240px]">
                  <Image
                    src={screenshot}
                    alt={`Zoomerly app screenshot ${index + 1}`}
                    className="w-full h-full border overflow-clip rounded-2xl shadow-lg"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="items-center justify-center gap-4 mt-6 hidden max-[900px]:flex">
            <button
              onClick={scrollLeft}
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${lastClicked === 'left'
                ? 'bg-gradient-to-r from-[#EA4088] to-[#885CB8] hover:opacity-90'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className={`w-6 h-6 ${lastClicked === 'left' ? 'text-white' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={scrollRight}
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${lastClicked === 'right'
                ? 'bg-gradient-to-r from-[#EA4088] to-[#885CB8] hover:opacity-90'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
              aria-label="Scroll right"
            >
              <ChevronRight className={`w-6 h-6 ${lastClicked === 'right' ? 'text-white' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsedYourWay;
