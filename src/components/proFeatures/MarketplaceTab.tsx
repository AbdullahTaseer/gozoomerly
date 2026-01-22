'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronRight } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import ShoppeView from './ShoppeView';
import ServicesView from './ServicesView';

const MarketplaceTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<'shoppe' | 'services'>('shoppe');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="px-[5%] py-4">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
            <GlobalInput
              placeholder="Search products services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputClassName="pl-10 pr-4 bg-gray-50 border-gray-200"
              bgColor="#F9FAFB"
              borderRadius="8px"
            />
          </div>
          <button className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-pink-500 transition-colors">
            <Filter className="text-gray-600" size={18} />
          </button>
        </div>
      </div>

      {}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveSubTab('shoppe')}
          className={`pb-2 px-2 text-md font-medium border-b-2 transition-colors ${
            activeSubTab === 'shoppe'
              ? 'text-pink-500 border-pink-500'
              : 'text-gray-600 border-white hover:text-gray-900'
          }`}
        >
          Shoppe
        </button>
        <button
          onClick={() => setActiveSubTab('services')}
          className={`pb-2 px-2 text-md border-b-2 font-medium transition-colors ${
            activeSubTab === 'services'
              ? 'text-pink-500 border-pink-500'
              : 'text-gray-500 border-white'
          }`}
        >
          Services
        </button>
      </div>

      {}
      {activeSubTab === 'shoppe' ? <ShoppeView /> : <ServicesView />}
    </div>
  );
};

export default MarketplaceTab;

