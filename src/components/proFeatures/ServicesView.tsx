'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import Gift1 from '@/assets/svgs/gifts/gift-1.svg';
import Gift2 from '@/assets/svgs/gifts/gift-2.svg';
import Gift3 from '@/assets/svgs/gifts/gift-3.svg';
import Gift4 from '@/assets/svgs/gifts/gift-4.svg';
import Gift5 from '@/assets/svgs/gifts/gift-5.svg';
import Gift6 from '@/assets/svgs/gifts/gift-6.svg';
import Gift7 from '@/assets/svgs/gifts/gift-7.svg';
import Gift8 from '@/assets/svgs/gifts/gift-8.svg';
import Gift9 from '@/assets/svgs/gifts/gift-9.svg';
import Gift10 from '@/assets/svgs/gifts/gift-10.svg';

const ServicesView = () => {
  const suggestedServices = [
    {
      id: 1,
      title: 'Order a Meal',
      description: 'Get ready-to-eat meals delivered or picked up locally.',
      icon: Gift1,
    },
    {
      id: 2,
      title: 'Book a Cleaner',
      description: 'Home, office, or commercial cleaning.',
      icon: Gift2,
    },
    {
      id: 3,
      title: 'Find a Tutor',
      description: 'Get personalized tutoring for any subject or skill.',
      icon: Gift3,
    },
    {
      id: 4,
      title: 'Book a Photographer',
      description: 'Professional photography for events and occasions.',
      icon: Gift4,
    },
    {
      id: 5,
      title: 'Hire a Designer',
      description: 'Graphic design, web design, and branding services.',
      icon: Gift5,
    },
    {
      id: 6,
      title: 'Get Medical Admin Help',
      description: 'Doctors/clinics outsourcing admin.',
      icon: Gift6,
    },
    {
      id: 7,
      title: 'Fix Plumbing or HVAC',
      description: 'Have plumbing, heating, or cooling issues.',
      icon: Gift7,
    },
    {
      id: 8,
      title: 'IT Support Services',
      description: 'Computer repair, network setup, and tech support.',
      icon: Gift8,
    },
  ];

  const topUsed = [
    {
      id: 1,
      title: 'Get Medical Admin Help',
      description: 'Doctors/clinics outsourcing admin.',
      icon: Gift6,
    },
    {
      id: 2,
      title: 'Fix Plumbing or HVAC',
      description: 'Have plumbing, heating, or cooling issues.',
      icon: Gift7,
    },
    {
      id: 3,
      title: 'IT Support Services',
      description: 'Computer repair, network setup, and tech support.',
      icon: Gift8,
    },
    {
      id: 4,
      title: 'Legal Consultation',
      description: 'Get legal advice from qualified professionals.',
      icon: Gift9,
    },
    {
      id: 5,
      title: 'Accounting Services',
      description: 'Bookkeeping, tax preparation, and financial planning.',
      icon: Gift10,
    },
    {
      id: 6,
      title: 'Get Medical Admin Help',
      description: 'Doctors/clinics outsourcing admin.',
      icon: Gift6,
    },
    {
      id: 7,
      title: 'Fix Plumbing or HVAC',
      description: 'Have plumbing, heating, or cooling issues.',
      icon: Gift7,
    },
    {
      id: 8,
      title: 'IT Support Services',
      description: 'Computer repair, network setup, and tech support.',
      icon: Gift8,
    },
    {
      id: 9,
      title: 'Legal Consultation',
      description: 'Get legal advice from qualified professionals.',
      icon: Gift9,
    },
    {
      id: 10,
      title: 'Accounting Services',
      description: 'Bookkeeping, tax preparation, and financial planning.',
      icon: Gift10,
    },
  ];

  const nearby = [
    {
      id: 1,
      title: 'Hire a Personal Chef',
      description: 'Want a chef to cook at home or for private events.',
      icon: Gift1,
    },
    {
      id: 2,
      title: 'Order Juices / Smoothies',
      description: 'Fresh juices, smoothies, or wellness drinks.',
      icon: Gift2,
    },
    {
      id: 3,
      title: 'Find a Fitness Trainer',
      description: 'Personal training sessions at home or gym.',
      icon: Gift3,
    },
    {
      id: 4,
      title: 'Book a Massage Therapist',
      description: 'Relaxing massage therapy at your location.',
      icon: Gift4,
    },
    {
      id: 6,
      title: 'Get Medical Admin Help',
      description: 'Doctors/clinics outsourcing admin.',
      icon: Gift6,
    },
    {
      id: 7,
      title: 'Fix Plumbing or HVAC',
      description: 'Have plumbing, heating, or cooling issues.',
      icon: Gift7,
    },
    {
      id: 8,
      title: 'IT Support Services',
      description: 'Computer repair, network setup, and tech support.',
      icon: Gift8,
    },
    {
      id: 5,
      title: 'Hire a Babysitter',
      description: 'Trusted childcare services for your family.',
      icon: Gift5,
    },
  ];

  const dealsOfTheDay = [
    {
      id: 1,
      title: 'Schedule a Handyman',
      description: 'Need small repairs or general fixes.',
      icon: Gift6,
    },
    {
      id: 2,
      title: 'Hire Movers',
      description: 'Relocating or clearing space.',
      icon: Gift7,
    },
    {
      id: 3,
      title: 'Garden Landscaping',
      description: 'Transform your outdoor space with professional landscaping.',
      icon: Gift8,
    },
    {
      id: 4,
      title: 'Pet Care Services',
      description: 'Pet sitting, walking, and grooming services.',
      icon: Gift9,
    },
    {
      id: 6,
      title: 'Get Medical Admin Help',
      description: 'Doctors/clinics outsourcing admin.',
      icon: Gift6,
    },
    {
      id: 7,
      title: 'Fix Plumbing or HVAC',
      description: 'Have plumbing, heating, or cooling issues.',
      icon: Gift7,
    },
    {
      id: 8,
      title: 'IT Support Services',
      description: 'Computer repair, network setup, and tech support.',
      icon: Gift8,
    },
    {
      id: 5,
      title: 'Home Security Setup',
      description: 'Install and configure home security systems.',
      icon: Gift10,
    },
  ];

  const ServiceCard = ({ service }: { service: { id: number; title: string; description: string; icon: any } }) => {
    return (
      <div className="min-w-[200px] text-center bg-[#15141B] rounded-lg p-4 md:p-6 cursor-pointer shadow-lg">
        <div className="mb-2 flex items-center justify-center h-24">
          <Image
            src={service.icon}
            alt={service.title}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <h3 className="text-md md:text-lg font-semibold mb-2 text-white">{service.title}</h3>
        <p className="text-sm text-white">{service.description}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Suggested for you Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Suggested for you</h2>
          <button className="text-pink-500 text-sm flex items-center gap-1">
            View all
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {suggestedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Top Used Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top Used</h2>
          <button className="text-pink-500 text-sm flex items-center gap-1">
            View all
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {topUsed.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Near by Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Near by</h2>
          <button className="text-pink-500 text-sm flex items-center gap-1">
            View all
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {nearby.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Deals of the day Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Deals of the day</h2>
          <button className="text-pink-500 text-sm flex items-center gap-1">
            View all
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {dealsOfTheDay.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesView;

