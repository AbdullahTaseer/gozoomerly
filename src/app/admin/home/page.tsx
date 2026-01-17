'use client';

import React, { useState } from 'react';
import {
  Search,
  Users,
  Layers,
  Gift,
  Clock,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import MoreFilters from '@/components/adminComponents/MoreFilters';

const AdminHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const dashboardCards = [
    {
      title: 'Total Users',
      value: '$592k',
      icon: Users,
    },
    {
      title: 'Total Boards',
      value: '25',
      icon: Layers,
    },
    {
      title: 'Total Gifts',
      value: '$7890k',
      subText: 'All-Time Gift Amount',
      icon: Gift,
    },
    {
      title: 'New Users',
      value: '1234',
      subText: 'Last 24 hours',
      icon: UserPlus,
    },
    {
      title: 'New Boards',
      value: '$592k',
      subText: 'Last 24 hours',
      icon: Layers,
    },
    {
      title: 'Gifts Pending Payout',
      value: '25',
      icon: Clock,
    },
    {
      title: 'Reported Content',
      value: '$7890k',
      subText: 'Open Cases',
      icon: AlertCircle,
    },
  ];

  return (
    <main className="flex-1 rounded-tl-lg overflow-y-auto">
      <div>
        <div className="max-[500px]:grid grid-cols-2 flex justify-end gap-4 my-6">
          <MoreFilters
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
          />
          <div className="max-[500px]:w-full w-[180px] relative bg-white">
            <GlobalInput
              id="search"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              width="100%"
              height="42px"
              className="relative"
              inputClassName="pr-10"
            />
            <div className="absolute right-3 top-[13px] pointer-events-none">
              <Search size={18} className="text-gray-900" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 xl:gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-md font-medium text-black">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                  </div>
                  <div className="bg-[#EFF3F8] p-2 sm:p-3 rounded-md">
                    <Icon color='black' className='h-4 w-4 sm:w-6 sm:h-6' />
                  </div>
                </div>
                {card.subText && (
                  <p className="text-xs text-gray-500">{card.subText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default AdminHome;
