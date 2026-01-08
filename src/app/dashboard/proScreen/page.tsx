'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import MarketplaceTab from '@/components/proFeatures/MarketplaceTab';
import SupplyPartnerTab from '@/components/proFeatures/SupplyPartnerTab';
import AmbassadorTab from '@/components/proFeatures/AmbassadorTab';
import ProDashboardTab from '@/components/proFeatures/ProDashboardTab';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';

const ProPage = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'supply-partner' | 'ambassador-business-circle' | 'pro-dashboard'>('marketplace');

  return (
    <div className="min-h-screen bg-white text-black">
      <DashNavbar/>
      <MobileHeader title="Pro" />
      <div>
        <div className="px-[5%] py-4">
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full whitespace-nowrap shrink-0 ${
                activeTab === 'marketplace'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Market place
            </button>
            <button
              onClick={() => setActiveTab('supply-partner')}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full whitespace-nowrap shrink-0 ${
                activeTab === 'supply-partner'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Supply partner
            </button>
            <button
              onClick={() => setActiveTab('ambassador-business-circle')}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full whitespace-nowrap shrink-0 ${
                activeTab === 'ambassador-business-circle'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Ambassador Business Circle
            </button>
            <button
              onClick={() => setActiveTab('pro-dashboard')}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full whitespace-nowrap shrink-0 ${
                activeTab === 'pro-dashboard'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Pro Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="pb-24">
        {activeTab === 'marketplace' && <MarketplaceTab />}
        {activeTab === 'supply-partner' && <SupplyPartnerTab />}
        {activeTab === 'ambassador-business-circle' && <AmbassadorTab />}
        {activeTab === 'pro-dashboard' && <ProDashboardTab />}
      </div>
    </div>
  );
};

export default ProPage;

