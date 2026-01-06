'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import GlobalButton from '@/components/buttons/GlobalButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AmbassadorTab = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const faqs = [
    {
      id: 'item-1',
      question: 'Is there a free trial available?',
      answer: "Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
    {
      id: 'item-2',
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    },
    {
      id: 'item-3',
      question: 'What is your cancellation policy?',
      answer: 'You can cancel your subscription at any time. There are no cancellation fees, and you will continue to have access until the end of your current billing period.',
    },
    {
      id: 'item-4',
      question: 'Can other info be added to an account?',
      answer: 'Yes, you can add additional information to your account at any time through your profile settings.',
    },
    {
      id: 'item-5',
      question: 'What are the benefits of becoming an Ambassador?',
      answer: 'As an Ambassador, you get access to exclusive business opportunities, networking events, priority support, and the ability to build your own business circle within the zoiax platform.',
    },
    {
      id: 'item-6',
      question: 'How does the Business Circle work?',
      answer: 'The Business Circle allows you to create and manage your own network of partners and clients, facilitating collaboration and growth opportunities within the zoiax ecosystem.',
    },
    {
      id: 'item-7',
      question: 'What are the different Ambassador packages?',
      answer: 'We offer multiple Ambassador packages tailored to different business needs, including Starter, Professional, and Enterprise levels, each with varying benefits and commission structures.',
    },
    {
      id: 'item-8',
      question: 'How do I get started as an Ambassador?',
      answer: 'Simply click the "Apply to become an Ambassador" button above, fill out the application form, and our team will review your submission and contact you within 2-3 business days.',
    },
  ];

  return (
    <div className="px-[5%] py-6">
      <div className="space-y-6">
        {/* Video Player */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-black">
          <video
            ref={videoRef}
            src="/zoiax-pro-video.mp4"
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-500/20 flex items-center justify-center border-2 border-pink-500 cursor-pointer hover:bg-pink-500/30 transition-colors"
                >
                  <Play className="text-pink-500 ml-1" size={24} fill="currentColor" />
                </button>
              </div>
            </div>
          )}
          {isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center border-2 border-white/50 cursor-pointer hover:bg-black/70 transition-colors"
            >
              <Pause className="text-white" size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-base text-gray-800 leading-relaxed">
            Apply to become an Ambassador to build your future with zoiax a limited once in a lifetime opportunity.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            What one Ambassador. What is business circle, what are Ambassador packages.
          </p>
          
          {/* Apply Button */}
          <GlobalButton
            title="Apply to become an Ambassador"
            width="100%"
            height="48px"
            onClick={() => {}}
          />
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Frequently asked questions</h2>
          <Accordion type="single" collapsible defaultValue="item-1" className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="mb-3">
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorTab;

