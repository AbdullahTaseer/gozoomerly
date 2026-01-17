'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  X,
  Users,
  Table2,
  Heart,
  Gift,
  Flag,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react';
import AppLogo from "@/assets/svgs/Zoomerly.svg";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
};

type AdminSidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const AdminSidebar = ({ isOpen = false, onClose }: AdminSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/home' },
    { label: 'Users Management', icon: Users, path: '/admin/users' },
    { label: 'Boards Management', icon: Table2, path: '/admin/boards' },
    { label: 'Wishes Management', icon: Heart, path: '/admin/wishes' },
    { label: 'Gifts Management', icon: Gift, path: '/admin/gifts' },
    { label: 'Reported Content', icon: Flag, path: '/admin/reported' },
    { label: 'Support Tickets', icon: MessageSquare, path: '/admin/support' }
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`fixed top-0 lg:top-6 left-0 lg:left-6 w-64 h-full lg:h-[calc(100vh-40px)] rounded-none lg:rounded-2xl bg-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >

      <div className="p-6 flex items-center justify-between">
        <Image
          src={AppLogo}
          alt="Zoomerly Logo"
          className="w-[140px] max-[900px]:w-[123px] cursor-pointer"
          onClick={() => handleNavigation('/admin/home')}
        />
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer text-left transition-colors ${active
                ? 'bg-black text-white font-medium'
                : 'hover:bg-gray-50 text-black'
                }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
