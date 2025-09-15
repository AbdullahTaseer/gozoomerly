import React from 'react';
import Image from 'next/image';
import Particles from "@/assets/svgs/why-people-love-particles.svg";

import Maria from "@/assets/svgs/Maria.svg";
import Sam from "@/assets/svgs/Sam.svg";
import Farah from "@/assets/svgs/Farah.svg";
import Sohail from "@/assets/svgs/Sohail.svg";
import Background from "@/assets/pngs/why-people-love-it-background.png";
// import { Confetti } from '../confetti';

const WhyPeopleLove = () => {
  const testimonials = [
    {
      quote: "“It felt like being in the same room with my family, even though we were on three continents.” ",
      name: "Maria A.",
      image: Maria,
      cardClassName: '-skew-y-1'
    },
    {
      quote: "“Our wedding board became the most beautiful album we could ever ask for.”",
      name: "Sam K.",
      image: Sam,
      cardClassName: '-skew-y-1'
    },
    {
      quote: "“Seeing the surprise board at midnight had me in tears.”",
      name: "Farah L.",
      image: Farah,
      cardClassName: 'skew-y-1'
    },
    {
      quote: "“Being part of a concert board made me feel like my voice mattered to the artist.”",
      name: "Sohail R.",
      image: Sohail,
      cardClassName: 'skew-y-1'
    }
  ];

  return (
    <div className='px-[5%] max-[769px]:px-4 py-5'>
      <div className='bg-[#F7F7F7] rounded-xl overflow-clip py-10 px-3 relative'>
        <Image src={Background} alt='' className='absolute inset-0' />
        <div className='absolute inset-0 pointer-events-none'>
          <Image src={Particles} alt="particles" className='absolute bottom-0 left-0' />
          <Image src={Particles} alt="particles" className='absolute top-0 right-0' />
        </div>

        {/* <Confetti
          autoFire={false}
          triggerOnScroll={true}
          autoFireDelay={300}
          showButton={false}
          buttonText="🎉 Celebrate!"
          buttonPosition="top-right"
          options={{
            particleCount: 100,
            colors: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB', '#32CD32', '#FF4500', '#1E90FF']
          }}
        /> */}

        <h2 className='text-center relative text-white text-[42px] max-[900px]:text-[30px] max-[600px]:text-[24px] font-bold'>
          Why People Love It
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto relative z-10 mt-6'>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-[10px] py-4 px-6 ${testimonial.cardClassName}`}
            >
              <div className='flex flex-col'>
                <blockquote className='text-black text-[20px] max-[900px]:text-[16px] leading-relaxed mb-6'>
                  &#34;{testimonial.quote}&#34;
                </blockquote>

                <div className='flex items-center gap-4'>
                  <div className='w-15 h-15 rounded-full overflow-hidden mb-4 border border-gray-200 shadow-sm'>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={80}
                      height={80}
                      className='w-full h-full object-cover'
                    />
                  </div>

                  <p className='text-black font-semibold text-lg'>
                    {testimonial.name}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyPeopleLove;