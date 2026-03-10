'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import BellIconIndicator from '@/components/cards/BellIconIndicator';
import GlobalInput from '@/components/inputs/GlobalInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    id: 'item-1',
    question: 'Is there a free trial available?',
    answer: "Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
  {
    id: 'item-2',
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately.',
  },
  {
    id: 'item-3',
    question: 'What is your cancellation policy?',
    answer: 'You can cancel your subscription at any time. Your access will continue until the end of your current billing period, and you won\'t be charged again.',
  },
  {
    id: 'item-4',
    question: 'Can other info be added to an invoice?',
    answer: 'Yes, you can add custom fields, notes, and additional details to your invoices through the invoice settings.',
  },
  {
    id: 'item-5',
    question: 'How does billing work?',
    answer: 'Billing is based on your selected plan. You can pay monthly or annually. We accept major credit cards and other payment methods.',
  },
];

const SupportPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="text-black">
      <DashNavbar />
      <MobileHeader
        title="Support"
        showBack
        onBackClick={() => router.push('/u/profile')}
        profileRight
      />

      <div className="max-[769px]:hidden flex justify-between items-center px-[5%] pt-6">
        <button
          onClick={() => router.push('/u/profile')}
          className="flex items-center gap-2 text-black"
        >
          <ArrowLeft size={24} />
          <span className="text-xl font-bold">Support</span>
        </button>
        <BellIconIndicator />
      </div>

      <div className="px-[5%] max-[769px]:px-4 py-6">
        <section className="p-4 sm:p-6 bg-[#F3F3F3] rounded-[12px]">
          <h2 className="text-xl font-bold text-black mb-4">Let&apos;s talk with us</h2>
          <div className="space-y-4">
            <div className='gap-4 grid sm:grid-cols-2'>
              <GlobalInput
                title='Name'
                labelFont='500'
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                height="44px"
                width="100%"
                borderRadius="8px"
                inputClassName="bg-white! border-[#C4C4C4]"
              />
              <GlobalInput
                labelFont='500'
                title='Phone'
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                height="44px"
                width="100%"
                borderRadius="8px"
                inputClassName="bg-white! border-[#C4C4C4]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                placeholder="Type here.."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[120px] px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none resize-none"
              />
            </div>
            <div className="flex justify-end pt-2">
              <GlobalButton
                title={'Submit'}
                width="120px"
                height="44px"
              />
            </div>
          </div>
        </section>

        <section className="pt-6">
          <h2 className="text-xl font-bold text-black mb-4">Faq</h2>
          <Accordion type="single" collapsible defaultValue="item-1" className="space-y-3">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
};

export default SupportPage;
