"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import DashNavbar from '@/components/navbar/DashNavbar';
import DashFooter from '@/components/footer/DashFooter';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || '';

  const hideNavbarForBoardDetail = /^\/dashboard\/boards\/[^\/]+$/.test(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbarForBoardDetail && <DashNavbar />}
      <main className="flex-1">
        {children}
      </main>
      <DashFooter/>
    </div>
  );
};

export default DashboardLayout;