"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/adminComponents/AdminSidebar';
import AdminNavbar from '@/components/adminComponents/AdminNavbar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <div className="flex-1 flex bg-[#F2F6FA] rounded-tl-lg overflow-hidden relative">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col lg:ml-[272px] px-4 lg:px-6">
          <AdminNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
