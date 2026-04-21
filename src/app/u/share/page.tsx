'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import BellIconIndicator from '@/components/cards/BellIconIndicator';
import GlobalInput from '@/components/inputs/GlobalInput';
import CoverCard from '@/components/cards/CoverCard';
import { shareScreenData } from '@/lib/MockData';

const SharePage = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredItems = shareScreenData.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.sharedWith.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-black">
      <DashNavbar />
      <MobileHeader
        title="Share"
        showBack
        onBackClick={() => router.push('/u/profile')}
        profileRight
      />

      <div className="px-[5%] max-[768px]:px-4 py-5">
        <div className="max-[769px]:hidden flex justify-between items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/u/profile')}
            className="flex items-center gap-2 text-black shrink-0"
          >
            <ArrowLeft size={24} />
            <span className="text-3xl font-bold">Share</span>
          </button>
          <div className="relative w-[260px] shrink-0">
            <Search size={18} className="absolute top-3 left-3 text-gray-500" />
            <GlobalInput
              placeholder="Search friends & family..."
              height="42px"
              width="100%"
              inputClassName="pl-10 rounded-full!"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="max-[769px]:block hidden mb-4">
          <div className="relative w-full max-w-[300px]">
            <Search size={18} className="absolute top-3 left-3 text-gray-500" />
            <GlobalInput
              placeholder="Search friends & family..."
              height="42px"
              width="100%"
              inputClassName="pl-10 rounded-full!"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <CoverCard
              key={item.id}
              coverImage={item.coverImage}
              title={item.title}
              variant="share"
              sharedWith={item.sharedWith}
              onClick={() => {}}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 py-12">No shared items found</p>
        )}
      </div>
    </div>
  );
};

export default SharePage;
