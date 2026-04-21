"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import DashFooter from '@/components/footer/DashFooter';
import BottomTabs from '@/components/footer/BottomTabs';
import ModalOrBottomSlider from '@/components/modals/ModalOrBottomSlider';
import { useAddStatusSubmit } from '@/hooks/useAddStatusSubmit';
import { createOrShareModalState } from '@/lib/createOrShareModalState';
import { chatOpenState } from '@/lib/chatOpenState';
import { OnlineStatusProvider } from '@/components/providers/OnlineStatusProvider';
import { OneSignalProvider } from '@/components/providers/OneSignalProvider';
import { NotificationToastProvider } from '@/components/providers/NotificationToastProvider';

const AddStatusModalContent = dynamic(
  () => import('@/components/modals/AddStatusModal'),
  { ssr: false }
);

const CreateOrShareModalContent = dynamic(
  () => import('@/components/modals/CreateOrShareModal'),
  { ssr: false }
);

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || '';
  const [isCreateOrShareModalOpen, setIsCreateOrShareModalOpen] = useState(false);
  const [isAddStatusOpen, setIsAddStatusOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { handleStatusImageSelect, handleStoryCreate, handleMultipleStoriesCreate } = useAddStatusSubmit();

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
      <OneSignalProvider>
      <NotificationToastProvider>
      <div className={`min-h-screen flex flex-col ${!shouldHideBottomTabs ? 'max-[769px]:pb-20' : ''}`}>
        <main className="flex-1">
          {children}
        </main>
        {!hideNavbarForBoardDetail && <DashFooter />}
        {!shouldHideBottomTabs && <BottomTabs />}
        <ModalOrBottomSlider
          isOpen={isCreateOrShareModalOpen}
          onClose={() => createOrShareModalState.close()}
          title='Create or Share'
          desktopClassName="max-w-md"
        >
          {isCreateOrShareModalOpen ? (
            <CreateOrShareModalContent
              onClose={() => createOrShareModalState.close()}
              onPostStatus={() => setIsAddStatusOpen(true)}
            />
          ) : null}
        </ModalOrBottomSlider>

        <ModalOrBottomSlider
          isOpen={isAddStatusOpen}
          onClose={() => setIsAddStatusOpen(false)}
          modalHeader={false}
          desktopClassName="max-w-md"
          contentClassName="px-4 pb-6"
        >
          {isAddStatusOpen ? (
            <AddStatusModalContent
              isOpen={isAddStatusOpen}
              onClose={() => setIsAddStatusOpen(false)}
              onImageSelect={handleStatusImageSelect}
              onStoryCreate={handleStoryCreate}
              onMultipleStoriesCreate={handleMultipleStoriesCreate}
            />
          ) : null}
        </ModalOrBottomSlider>
      </div>
      </NotificationToastProvider>
      </OneSignalProvider>
    </OnlineStatusProvider>
  );
};

export default UserLayout;