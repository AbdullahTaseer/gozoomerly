'use client';

import React, { ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  CircleHelp,
} from 'lucide-react';
import AppLogo from "@/assets/svgs/Zoomerly.svg";

type NavItem = {
  label: string;
  icon: ComponentType<{ size?: number }>;
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
    { label: 'Support Tickets', icon: MessageSquare, path: '/admin/support' },
    { label: 'FAQs', icon: CircleHelp, path: '/admin/faqs' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogoHome = () => {
    router.push('/admin/home');
    onClose?.();
  };

  const sidebarBody = (
    <>
      <div className="p-6 flex items-center justify-between shrink-0">
        <Image
          src={AppLogo}
          alt="Zoomerly Logo"
          className="w-[140px] max-[900px]:w-[123px] cursor-pointer"
          onClick={handleLogoHome}
        />
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      <nav
        className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={index}
              href={item.path}
              onClick={() => onClose?.()}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer text-left transition-colors ${active
                ? 'bg-black text-white font-medium'
                : 'hover:bg-gray-50 text-black'
                }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile: one fixed stack — dimmer first (behind), panel on top so taps never hit the screen */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[200] lg:hidden"
          aria-modal
          aria-label="Admin menu"
        >
          <button
            type="button"
            className="absolute inset-0 z-0 bg-black/50 cursor-default border-0 p-0"
            aria-label="Close menu"
            onClick={() => onClose?.()}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 z-10 flex w-64 max-w-[85vw] flex-col bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {sidebarBody}
          </aside>
        </div>
      ) : null}

      {/* Desktop: fixed column (no overlay) */}
      <aside className="hidden lg:flex fixed top-6 left-6 z-40 h-[calc(100vh-40px)] w-64 flex-col rounded-2xl bg-white shadow-sm border border-gray-100">
        {sidebarBody}
      </aside>
    </>
  );
};

export default AdminSidebar;
