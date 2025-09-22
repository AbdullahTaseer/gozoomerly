"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import image_1 from "@/assets/pngs/different-board-1.png";
import image_2 from "@/assets/pngs/different-board-2.png";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import TitleCard from "../cards/TitleCard";

interface CarouselCardProps {
  title: string;
  description: string;
  imageSrc?: string | StaticImport;
  isActive: boolean;
}

const CarouselCard: React.FC<CarouselCardProps> = ({
  title,
  description,
  imageSrc,
  isActive,
}) => {
  return (
    <div
      className={`relative max-[768px]:mx-3 w-[470px] max-[768px]:w-[320px] max-[768px]:h-[400px] shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${isActive ? "scale-100" : "scale-100"
        }`}
    >
      <Image src={imageSrc || image_1} alt={title} className="h-full object-cover" />
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm leading-relaxed max-w-[90%]">{description}</p>
      </div>
    </div>
  );
};

const DifferentBoardCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const carouselData = [
    {
      title: "Birthdays & Surprise Boards",
      description:
        "Families worldwide share wishes, videos, and photos on one board.",
      imageSrc: image_1,
    },
    {
      title: "Weddings Boards",
      description:
        "Guests share photos and blessings from the big day, while couples receive contributions toward honeymoons or life goals.",
      imageSrc: image_2,
    },
    {
      title: "Condolence Boards",
      description: "Fans upload photos and videos from the event.",
      imageSrc: image_1,
    },
    {
      title: "Graduation Boards",
      description:
        "Celebrate academic achievements with messages and memories from friends and family.",
      imageSrc: image_2,
    },
    {
      title: "Graduation Boards",
      description:
        "Celebrate academic achievements with messages and memories from friends and family.",
      imageSrc: image_1,
    },
  ];


  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleIndex = activeIndex;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleIndex = Number(entry.target.getAttribute("data-index"));
          }
        });

        if (mostVisibleIndex !== activeIndex) {
          setActiveIndex(mostVisibleIndex);
        }
      },
      {
        root: containerRef.current,
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [activeIndex]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="px-[5%] max-[769px]:px-4 max-[768px]:px-0">
      <div className="bg-[#F7F7F7] py-10 rounded-xl max-[768px]:rounded-none">

        <TitleCard title="Types of Boards" />

        <div className="mt-10">
          <div className="relative">
            <div
              id="carousel-container"
              ref={containerRef}
              className="flex gap-6 max-[768px]:gap-0 overflow-x-auto pb-8 scrollbar-hide"
            >
              {carouselData.map((card, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  data-index={index}
                >
                  <CarouselCard
                    title={card.title}
                    description={card.description}
                    imageSrc={card.imageSrc}
                    isActive={index === activeIndex}
                  />
                </div>
              ))}
            </div>

            <div className="flex max-[768px]:hidden justify-center gap-3 mt-6">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                    ? "bg-pink-500 scale-110 w-7"
                    : "bg-gray-300 hover:bg-gray-400 w-2"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifferentBoardCarousel;