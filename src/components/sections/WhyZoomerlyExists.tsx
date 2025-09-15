import React from 'react';
import Image from 'next/image';

import MapImg from "@/assets/svgs/World-Map.svg";
import Icon_1 from "@/assets/svgs/why-1.svg";
import Icon_2 from "@/assets/svgs/why-2.svg";
import Icon_3 from "@/assets/svgs/why-3.svg";
import Icon_4 from "@/assets/svgs/why-4.svg";

const data = [
  {
    icon: Icon_1,
    heading: "Bring everyone together even across continents",
    desc: 'Connect family and friends from around the world in one shared celebration space.'
  },
  {
    icon: Icon_2,
    heading: "Make memories permanent not lost in feeds or inboxes",
    desc: 'Preserve special moments forever in organized, beautiful collections.'
  },
  {
    icon: Icon_3,
    heading: "Add meaning to gifting with group goals and personalized contributions",
    desc: 'Transform gift-giving into collaborative experiences with shared goals and meaningful messages.'
  },
  {
    icon: Icon_4,
    heading: "Create emotional experiences like surprise boards delivered at midnight",
    desc: 'Design unforgettable moments with perfectly timed reveals and surprise elements.'
  },
]

const WhyZoomerlyExists = () => {
  return (
    <div className='px-[5%] max-[769px]:px-4 py-10'>
      <p className='text-center text-[42px] max-[900px]:text-[30px] max-[600px]:text-[24px] font-bold'>Why Zoomerly Exists</p>
      <p className="text-center max-w-2xl mx-auto text-sm text-black mt-2">
        We believe celebrations shouldn't be limited to one day or one place. People are often spread across the world, and moments slip away in private chats or scattered photos.
      </p>
      <div className='grid md:grid-cols-2 max-md:gap-6 mt-12'>
        <div className='space-y-6 max-md:order-1'>
          {data.map((item, i) => (
            <div key={i} className='flex items-start gap-3'>
              <Image src={item.icon} alt='icon' height={60} width={60} />
              <div>
                <p className='font-semibold text-[20px] max-[1200px]:text-[16px]'>{item.heading}</p>
                <p className='text-sm mt-1'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Image src={MapImg} alt='' className='m-auto' />
      </div>
    </div>
  );
};

export default WhyZoomerlyExists;