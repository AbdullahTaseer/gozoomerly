"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/adminComponents/AdminSidebar';
import AdminNavbar from '@/components/adminComponents/AdminNavbar';
import { authService } from '@/lib/supabase/auth';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin';

  useEffect(() => {
    let cancelled = false;

    const checkAdminSession = async () => {
      const session = await authService.getSession();
      if (cancelled) {
        return;
      }

      const loggedIn = Boolean(session);
      setIsAuthenticated(loggedIn);
      setIsCheckingAuth(false);

      if (isLoginPage && loggedIn) {
        router.replace('/admin/home');
        return;
      }

      if (!isLoginPage && !loggedIn) {
        router.replace('/admin');
      }
    };

    checkAdminSession();

    return () => {
      cancelled = true;
    };
  }, [isLoginPage, pathname, router]);

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-[#F2F6FA]" />;
  }

  if (isLoginPage && isAuthenticated) {
    return null;
  }

  if (!isLoginPage && !isAuthenticated) {
    return null;
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F2F6FA]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA]">
      <div className="flex bg-[#F2F6FA] relative">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className='absolute z-40 inset-0 bg-black/60 min-h-screen' />
        )}

        <div className="flex-1 lg:ml-[272px] px-4 lg:px-6 min-w-0">
          <AdminNavbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
