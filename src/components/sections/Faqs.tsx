import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faqs = () => {
  return (
    <div className='px-[5%] max-[769px]:px-4 py-10'>
      <p className='text-center text-[42px] max-[900px]:text-[30px] max-[600px]:text-[24px] font-bold'>Frequently asked questions</p>
      <div className='mt-6 space-y-6 max-w-2xl mx-auto'>
        <Accordion className='space-y-6' type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Can the goal be exceeded?</AccordionTrigger>
            <AccordionContent>
              Yes the goal is just a milestone. Love (and gifts) can go far beyond it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I create a wish without sending a gift?</AccordionTrigger>
            <AccordionContent>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can people join from anywhere?</AccordionTrigger>
            <AccordionContent>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How long does the board stay?</AccordionTrigger>
            <AccordionContent>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Faqs;