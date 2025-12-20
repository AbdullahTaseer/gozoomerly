"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DashFooter from '@/components/footer/DashFooter';
import BottomTabs from '@/components/footer/BottomTabs';
import CreateOrShareModal from '@/components/modals/CreateOrShareModal';
import { createOrShareModalState } from '@/lib/createOrShareModalState';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || '';
  const [isCreateOrShareModalOpen, setIsCreateOrShareModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = createOrShareModalState.subscribe(setIsCreateOrShareModalOpen);
    return unsubscribe;
  }, []);

  const hideNavbarForBoardDetail = /^\/dashboard\/boards\/[^\/]+$/.test(pathname);

  return (
    <div className="min-h-screen max-[769px]:pb-20 flex flex-col">
      {/* {!hideNavbarForBoardDetail && <DashNavbar />} */}
      <main className="flex-1">
        {children}
      </main>
      {!hideNavbarForBoardDetail && <DashFooter />}
      <BottomTabs />
      <CreateOrShareModal 
        isOpen={isCreateOrShareModalOpen} 
        onClose={() => createOrShareModalState.close()} 
      />
    </div>
  );
};

export default DashboardLayout;