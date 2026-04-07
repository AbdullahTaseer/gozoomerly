'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, User, Settings, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import BellIcon from "@/assets/svgs/bell.svg";
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';

type AdminNavbarProps = {
  onMenuClick?: () => void;
};

const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [adminDisplayName, setAdminDisplayName] = useState('Admin');
  const [adminInitial, setAdminInitial] = useState('A');
  const [adminAvatarUrl, setAdminAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await authService.getUser();
        if (!user || cancelled) return;
        const supabase = createClient();
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, profile_pic_url')
          .eq('id', user.id)
          .maybeSingle();
        if (cancelled) return;
        const metaName =
          typeof user.user_metadata?.full_name === 'string'
            ? user.user_metadata.full_name.trim()
            : '';
        const profileName = profile?.name?.trim() || '';
        const fromEmail = user.email?.split('@')[0]?.trim() || '';
        const name = profileName || metaName || fromEmail || 'Admin';
        setAdminDisplayName(name);
        setAdminInitial(name.charAt(0).toUpperCase() || 'A');
        const pic = profile?.profile_pic_url?.trim();
        if (pic && pic !== 'null' && pic !== 'undefined') {
          setAdminAvatarUrl(pic);
        }
      } catch {
        /* keep defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getPageTitle = () => {
    const titleMap: { [key: string]: string } = {
      '/admin/home': 'Dashboard Overview',
      '/admin/users': 'Users Management',
      '/admin/boards': 'Boards Management',
      '/admin/wishes': 'Wishes Management',
      '/admin/gifts': 'Gifts Management',
      '/admin/reported': 'Reported Content',
      '/admin/support': 'Support Tickets',
      '/admin/faqs': 'FAQs Management',
    };

    return titleMap[pathname] || 'Admin Dashboard';
  };

  const handleLogout = () => {
    router.push('/admin');
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu size={24} className="text-gray-900" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-6">
        <Image src={BellIcon} alt='' height={24} width={24} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="hidden md:flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity bg-white px-4 py-3 rounded-md">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shadow-sm shrink-0 bg-gradient-to-br from-orange-300 to-orange-400">
                {adminAvatarUrl ? (
                  <img
                    src={adminAvatarUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">{adminInitial}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-sm text-gray-700 leading-tight">Welcome back,</span>
                <span className="text-sm font-bold text-gray-900 leading-tight truncate max-w-[140px] sm:max-w-[200px]">
                  {adminDisplayName}
                </span>
              </div>
              <ChevronDown size={16} className="text-gray-600" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4 text-black" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4 text-black" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminNavbar;
