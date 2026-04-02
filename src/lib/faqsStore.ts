export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
};

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'default-1',
    sortOrder: 1,
    isActive: true,
    question: 'Do guests need the app?',
    answer:
      'No — guests can join, view boards, and share memories directly from any browser. The app just makes it easier for frequent users.',
  },
  {
    id: 'default-2',
    sortOrder: 2,
    isActive: true,
    question: 'How do gifts work?',
    answer:
      'Guests can contribute money, messages, or group gifts. Everything is tracked and organized in one place, making it personal and meaningful rather than transactional.',
  },
  {
    id: 'default-3',
    sortOrder: 3,
    isActive: true,
    question: 'Are boards private?',
    answer:
      'Yes — only the people you invite can see or post on a board. You stay in full control of your event’s privacy and access.',
  },
  {
    id: 'default-4',
    sortOrder: 4,
    isActive: true,
    question: 'Do boards last forever?',
    answer:
      'Absolutely. Boards don’t disappear after the event — they remain as digital keepsakes that can be revisited anytime.',
  },
  {
    id: 'default-5',
    sortOrder: 5,
    isActive: true,
    question: 'Is it only for birthdays?',
    answer:
      'Not at all. Zoomerly can be used for weddings, baby showers, graduations, retirements, or any celebration where memories matter.',
  },
];

function sortFaqs(list: FaqItem[]): FaqItem[] {
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder || a.question.localeCompare(b.question));
}

/** Static copy for marketing when Supabase is unavailable or returns an error */
export function getDisplayFaqs(): FaqItem[] {
  return sortFaqs([...DEFAULT_FAQS]);
}
