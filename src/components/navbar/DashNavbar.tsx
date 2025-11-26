'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { X } from 'lucide-react';
import AppLogo from "@/assets/svgs/Zoomerly.svg";
import MenuIcon from "@/assets/svgs/menu-icon.svg";
import AnimatedButton from '../buttons/AnimatedButton';

const mobileOptions = ["Home", "Boards", "Chat", "Circles"];
const desktopOptions = ["Home", "Boards", "Chat", "Circles"];

const DashNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (option: string) => {
    if (option === "Home") {
      return pathname === "/dashboard/home";
    }
    if (option === "Boards") {
      return pathname === "/dashboard/allBoards";
    }
    if (option === "Chat") {
      return pathname === "/dashboard/chat";
    }
    if (option === "Circles") {
      return pathname === "/dashboard/circles";
    }

    return false;
  };

  const getActiveStyles = (option: string) => {
    return isActive(option)
      ? 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent from-pink-500 to-purple-600'
      : 'text-[#000000] hover:opacity-70';
  };

  const handleNavigation = (option: string) => {
    switch (option) {
      case "Home":
        router.push("/dashboard/home");
        break;
      case "Boards":
        router.push("/dashboard/allBoards");
        break;
      case "Chat":
        router.push("/dashboard/chat");
        break;
      case "Circles":
        router.push("/dashboard/circles");
        break;
      default:
        break;
    }
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className='flex justify-between items-center gap-3 px-[5%] max-[769px]:px-4 pb-4 pt-4 max-[1024px]:pb-3 bg-white sticky shadow-sm top-0 z-[100]'>
        <Image
          className='hidden max-[900px]:block cursor-pointer'
          src={MenuIcon}
          alt='Menu'
          height={20}
          width={20}
          onClick={() => setIsSidebarOpen(true)}
        />
        <Image src={AppLogo} onClick={() => router.push("/dashboard")} alt="Logo" className='w-[140px] max-[900px]:w-[123px] cursor-pointer' />
        <div className='flex items-center gap-6 max-[900px]:hidden'>
          {desktopOptions.map((option, i) => (
            <p
              key={i}
              className={`text-[16px] cursor-pointer transition-all duration-300 ${getActiveStyles(option)}`}
              onClick={() => handleNavigation(option)}
            >
              {option}
            </p>
          ))}
          <AnimatedButton onClick={() => router.push("/compaign")} height='42px' title='Create a Board' width='150px' />
        </div>
        <AnimatedButton onClick={() => router.push("/signup")} title='Sign up' height='42px' width='120px' className='hidden max-[900px]:flex' />
      </div>

      <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        style={{ zIndex: 200 }}
      />

      <div className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ zIndex: 300 }}>

        <div className='flex justify-between items-center p-4 border-b border-gray-200'>
          <Image src={AppLogo} alt="Logo" width={120} height={40} />
          <X className='cursor-pointer' onClick={() => setIsSidebarOpen(false)} />
        </div>

        <div className='flex flex-col gap-4 px-6 py-4'>
          {mobileOptions.map((option, i) => (
            <p
              key={i}
              className={`text-[16px] cursor-pointer transition-all duration-300 ${isActive(option)
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold'
                : 'text-black hover:opacity-70'
                }`}
              onClick={() => handleNavigation(option)}
            >
              {option}
            </p>
          ))}
          <AnimatedButton onClick={() => router.push("/compaign")} height='42px' title='Create a Board' />
        </div>

      </div>
    </>
  );
};

export default DashNavbar;