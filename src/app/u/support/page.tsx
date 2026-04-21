'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import BellIconIndicator from '@/components/cards/BellIconIndicator';
import GlobalInput from '@/components/inputs/GlobalInput';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { listFaqs } from '@/lib/supabase/faqs';
import { createSupportTicket } from '@/lib/supabase/support';
import type { FaqItem } from '@/lib/faqsStore';
import { Skeleton } from '@/components/skeletons';

const SupportPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [faqLoading, setFaqLoading] = useState(true);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const loadFaqs = useCallback(async () => {
    setFaqLoading(true);
    const { data, error } = await listFaqs({ includeInactive: false });
    if (error) {
      toast.error(error.message || 'Could not load FAQs');
      setFaqs([]);
    } else {
      setFaqs(data ?? []);
    }
    setFaqLoading(false);
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const validate = (): boolean => {
    const next: { name?: string; phone?: string } = {};
    if (!name.trim()) {
      next.name = 'Name is required.';
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      next.phone = 'Phone is required.';
    } else if (phoneDigits.length < 7) {
      next.phone = 'Please enter a valid phone number.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    const { error } = await createSupportTicket({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim() || '—',
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || 'Please try again later.');
      return;
    }

    toast.success('Your message has been submitted.');
    setName('');
    setPhone('');
    setMessage('');
    setErrors({});
  };

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
          type="button"
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="gap-4 grid sm:grid-cols-2">
              <GlobalInput
                title="Name"
                labelFont="500"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                height="44px"
                width="100%"
                inputClassName="bg-white! border-[#C4C4C4] rounded-[8px]!"
                error={errors.name}
              />
              <GlobalInput
                title="Phone"
                labelFont="500"
                type="tel"
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                height="44px"
                width="100%"
                inputClassName="bg-white! border-[#C4C4C4] rounded-[8px]!"
                error={errors.phone}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                placeholder="Type here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[120px] px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none resize-none"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="gap-2 flex justify-center items-center text-[15px] max-[540px]:text-[13px] tracking-[0.1px] rounded-[50px] text-white font-semibold px-6"
                style={{
                  width: '120px',
                  height: '44px',
                  background: submitting
                    ? '#e5e5e5'
                    : 'linear-gradient(90deg, #FF4E94 0%, #8B5CF6 100%)',
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        </section>

        <section className="pt-6">
          <h2 className="text-xl font-bold text-black mb-4">Faq</h2>
          {faqLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <p className="text-gray-500 text-sm">No FAQs available right now.</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </section>
      </div>
    </div>
  );
};

export default SupportPage;
