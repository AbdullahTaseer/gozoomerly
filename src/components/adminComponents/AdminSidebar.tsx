'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Users,
  Layers,
  Heart,
  Gift,
  Flag,
  MessageCircle
} from 'lucide-react';
import AppLogo from "@/assets/svgs/Zoomerly.svg";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
};

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: Layers, path: '/admin/home' },
    { label: 'Users Management', icon: Users, path: '/admin/users' },
    { label: 'Boards Management', icon: Layers, path: '/admin/boards' },
    { label: 'Wishes Management', icon: Heart, path: '/admin/wishes' },
    { label: 'Gifts Management', icon: Gift, path: '/admin/gifts' },
    { label: 'Reported Content', icon: Flag, path: '/admin/reported' },
    { label: 'Support Tickets', icon: MessageCircle, path: '/admin/support' }
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <aside className="w-64 ml-6 rounded-2xl bg-white flex flex-col my-6">

      <div className="p-6">
        <Image
          src={AppLogo}
          alt="Zoomerly Logo"
          className="w-[140px] max-[900px]:w-[123px] cursor-pointer"
          onClick={() => router.push('/admin/home')}
        />
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
