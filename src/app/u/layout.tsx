"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DashFooter from '@/components/footer/DashFooter';
import BottomTabs from '@/components/footer/BottomTabs';
import CreateOrShareModal from '@/components/modals/CreateOrShareModal';
import { createOrShareModalState } from '@/lib/createOrShareModalState';
import { chatOpenState } from '@/lib/chatOpenState';
import { OnlineStatusProvider } from '@/components/providers/OnlineStatusProvider';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || '';
  const [isCreateOrShareModalOpen, setIsCreateOrShareModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = createOrShareModalState.subscribe(setIsCreateOrShareModalOpen);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = chatOpenState.subscribe(setIsChatOpen);
    return unsubscribe;
  }, []);

  const hideNavbarForBoardDetail = /^\/u\/boards\/[^\/]+$/.test(pathname);
  const shouldHideBottomTabs = isChatOpen;

  return (
    <OnlineStatusProvider>
      <div className={`min-h-screen flex flex-col ${!shouldHideBottomTabs ? 'max-[769px]:pb-20' : ''}`}>
        { }
        <main className="flex-1">
          {children}
        </main>
        {!hideNavbarForBoardDetail && <DashFooter />}
        {!shouldHideBottomTabs && <BottomTabs />}
        <CreateOrShareModal
          isOpen={isCreateOrShareModalOpen}
          onClose={() => createOrShareModalState.close()}
        />
      </div>
    </OnlineStatusProvider>
  );
};

export default UserLayout;