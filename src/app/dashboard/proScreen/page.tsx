'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import MarketplaceTab from '@/components/proFeatures/MarketplaceTab';
import SupplyPartnerTab from '@/components/proFeatures/SupplyPartnerTab';
import AmbassadorTab from '@/components/proFeatures/AmbassadorTab';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';

const ProPage = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'supply-partner' | 'ambassador'>('marketplace');

  return (
    <div className="min-h-screen bg-white text-black">
      <DashNavbar/>
      <MobileHeader title="Pro" />
      <div>
        <div className="px-[5%] py-4">
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
                activeTab === 'marketplace'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Market place
            </button>
            <button
              onClick={() => setActiveTab('supply-partner')}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
                activeTab === 'supply-partner'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Supply partner
            </button>
            <button
              onClick={() => setActiveTab('ambassador')}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
                activeTab === 'ambassador'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Ambassador B
            </button>
          </div>
        </div>
      </div>

      <div className="pb-24">
        {activeTab === 'marketplace' && <MarketplaceTab />}
        {activeTab === 'supply-partner' && <SupplyPartnerTab />}
        {activeTab === 'ambassador' && <AmbassadorTab />}
      </div>
    </div>
  );
};

export default ProPage;

