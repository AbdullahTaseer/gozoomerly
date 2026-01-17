"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/adminComponents/AdminSidebar';
import AdminNavbar from '@/components/adminComponents/AdminNavbar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';

  if (isLoginPage) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F2F6FA]">
        {children}
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#F2F6FA]">
      <div className="flex-1 flex bg-[#F2F6FA] rounded-tl-lg overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminNavbar />
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
