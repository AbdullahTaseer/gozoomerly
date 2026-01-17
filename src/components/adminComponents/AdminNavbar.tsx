'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, User, Settings, LogOut, Menu } from 'lucide-react';
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

type AdminNavbarProps = {
  onMenuClick?: () => void;
};

const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    const titleMap: { [key: string]: string } = {
      '/admin/home': 'Dashboard Overview',
      '/admin/users': 'Users Management',
      '/admin/boards': 'Boards Management',
      '/admin/wishes': 'Wishes Management',
      '/admin/gifts': 'Gifts Management',
      '/admin/reported': 'Reported Content',
      '/admin/support': 'Support Tickets'
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
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-6">
        <Image src={BellIcon} alt='' height={24} width={24} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="hidden md:flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity bg-white px-4 py-3 rounded-md">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center overflow-hidden shadow-sm">
                <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center text-white font-semibold text-lg">
                  J
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 leading-tight">Welcome back,</span>
                <span className="text-sm font-bold text-gray-900 leading-tight">Joolie</span>
              </div>
              <ChevronDown size={16} className="text-gray-600" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
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
