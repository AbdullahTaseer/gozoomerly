import React from 'react';
import DashNavbar from '@/components/navbar/DashNavbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="min-h-screen flex flex-col">
      <DashNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;