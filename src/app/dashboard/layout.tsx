import React from 'react';
import DashNavbar from '@/components/navbar/DashNavbar';
import DashFooter from '@/components/footer/DashFooter';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="min-h-screen flex flex-col">
      <DashNavbar />
      <main className="flex-1">
        {children}
      </main>
      <DashFooter/>
    </div>
  );
};

export default DashboardLayout;