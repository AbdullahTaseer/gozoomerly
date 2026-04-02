'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import TitleCard from '../cards/TitleCard';
import { type FaqItem, getDisplayFaqs } from '@/lib/faqsStore';
import { listFaqs } from '@/lib/supabase/faqs';

const Faqs = () => {
  const [items, setItems] = useState<FaqItem[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await listFaqs({ includeInactive: false });
      if (cancelled) return;
      if (error) {
        setLoadError(true);
        setItems(getDisplayFaqs());
        return;
      }
      setLoadError(false);
      setItems(data ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="px-[5%] max-[769px]:px-4 py-10">
      <TitleCard title="Frequently asked questions" />

      {loadError ? (
        <p className="text-center text-amber-700 text-sm mt-4 max-w-2xl mx-auto">
          Showing default FAQs — live content could not be loaded.
        </p>
      ) : null}

      <div className="mt-6 space-y-6 max-w-2xl mx-auto">
        {items === null ? (
          <p className="text-center text-gray-500 text-sm py-8">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">No questions yet.</p>
        ) : (
          <Accordion className="space-y-6" type="single" collapsible>
            {items.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="mb-3">
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default Faqs;
