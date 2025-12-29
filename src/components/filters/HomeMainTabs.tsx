'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import BoardIcon from "@/assets/svgs/board-icon-tab.svg";
import ZoiaxPro from "@/assets/svgs/zoiax-pro.svg";
import Marketplace from "@/assets/svgs/marketplace.svg";

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { id: 'boards', label: 'Boards', icon: BoardIcon },
  { id: 'zoiax-pro', label: 'Zoiax Pro', icon: ZoiaxPro },
  { id: 'marketplace', label: 'Marketplace', icon: Marketplace },
];

interface HomeMainTabsProps {
  onTabChange?: (tabId: string) => void;
  boardsChildren?: React.ReactNode;
  zoiaxProChildren?: React.ReactNode;
  marketplaceChildren?: React.ReactNode;
  defaultTab?: string;
}

const HomeMainTabs: React.FC<HomeMainTabsProps> = ({
  onTabChange,
  boardsChildren,
  zoiaxProChildren,
  marketplaceChildren,
  defaultTab = 'boards'
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div>
      <div className='flex items-center justify-center gap-8 md:gap-12 py-6 max-[769px]:gap-6'>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className='flex flex-col items-center gap-2 cursor-pointer transition-all hover:opacity-80'
          >
            <div className='relative w-16 h-16 max-[769px]:w-10 max-[769px]:h-10'>
              <Image
                src={tab.icon}
                alt={tab.label}
                fill
                className='object-contain'
              />
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-black font-medium text-sm md:text-base max-[769px]:text-xs'>
                {tab.label}
              </span>
              <div className={`w-full h-0.5 ${activeTab === tab.id ? "bg-gray-800" : "bg-white"}  mt-1`} />
            </div>
          </div>
        ))}
      </div>

      <div className='mt-4'>
        {activeTab === 'boards' && boardsChildren && (
          <div>{boardsChildren}</div>
        )}
        {activeTab === 'zoiax-pro' && zoiaxProChildren && (
          <div>{zoiaxProChildren}</div>
        )}
        {activeTab === 'marketplace' && marketplaceChildren && (
          <div>{marketplaceChildren}</div>
        )}
      </div>
    </div>
  );
};

export default HomeMainTabs;
