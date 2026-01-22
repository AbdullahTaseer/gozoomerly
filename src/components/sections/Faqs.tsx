import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TitleCard from '../cards/TitleCard';

const Faqs = () => {
  return (
    <div className='px-[5%] max-[769px]:px-4 py-10'>

      <TitleCard title="Frequently asked questions" />

      <div className='mt-6 space-y-6 max-w-2xl mx-auto'>
        <Accordion className='space-y-6' type="single" collapsible>

          <AccordionItem value="item-1">
            <AccordionTrigger>Do guests need the app?</AccordionTrigger>
            <AccordionContent>
              No — guests can join, view boards, and share memories directly from any browser.
              The app just makes it easier for frequent users.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How do gifts work?</AccordionTrigger>
            <AccordionContent>
              Guests can contribute money, messages, or group gifts.
              Everything is tracked and organized in one place, making it personal and meaningful rather than transactional.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Are boards private?</AccordionTrigger>
            <AccordionContent>
              Yes — only the people you invite can see or post on a board.
              You stay in full control of your event’s privacy and access.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Do boards last forever?</AccordionTrigger>
            <AccordionContent>
              Absolutely. Boards don’t disappear after the event —
              they remain as digital keepsakes that can be revisited anytime.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Is it only for birthdays?</AccordionTrigger>
            <AccordionContent>
              Not at all. Zoomerly can be used for weddings, baby showers,
              graduations, retirements, or any celebration where memories matter.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
};

export default Faqs;
