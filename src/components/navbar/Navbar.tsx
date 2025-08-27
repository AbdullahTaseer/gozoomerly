'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { X } from 'lucide-react';
import AppLogo from "@/assets/svgs/Zoomerly.svg";
import MenuIcon from "@/assets/svgs/menu-icon.svg";
import GlobalButton from '../buttons/GlobalButton';

const mobileOptions = ["Home", "Why Zoomerly Exists", "Have a question?", "Sign in"];
const desktopOptions = ["Home", "Why Zoomerly Exists", "Have a question?", "Sign in"];

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (option: string) => {
    if (option === "Home") {
      return pathname === "/";
    }
    if (option === "Why Zoomerly Exists") {
      return pathname === "/whyZoomerlyExists";
    }
    if (option === "Have a question?") {
      return pathname === "/haveQuestion";
    }
    if (option === "Sign in") {
      return pathname === "/signin";
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
        router.push("/");
        break;
      case "Why Zoomerly Exists":
        router.push("/whyZoomerlyExists");
        break;
      case "Have a question?":
        router.push("/haveQuestion");
        break;
      case "Sign in":
        router.push("/signin");
        break;
      default:
        break;
    }
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className='flex justify-between items-center gap-3 px-[4%] max-[769px]:px-6 py-4 max-[1024px]:py-3 bg-white sticky top-0 z-[100]'>
        <Image
          className='hidden max-[900px]:block cursor-pointer'
          src={MenuIcon}
          alt='Menu'
          height={20}
          width={20}
          onClick={() => setIsSidebarOpen(true)}
        />
        <Image src={AppLogo} onClick={() => router.push("/")} alt="Logo" className='max-[900px]:w-[120px] cursor-pointer' />
        <div className='flex items-center gap-6 max-[900px]:hidden'>
          {desktopOptions.map((option, i) => (
            <p
              key={i}
              className={`text-[15px] cursor-pointer transition-all duration-300 ${getActiveStyles(option)}`}
              onClick={() => handleNavigation(option)}
            >
              {option}
            </p>
          ))}
          <GlobalButton title='Create a Board' width='120px' />
        </div>
        <GlobalButton onClick={() => router.push("/signin")} title='Sign in' width='80px' className='hidden max-[900px]:flex' />
      </div>

      <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        style={{ zIndex: 99 }}
      />

      <div className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ zIndex: 100 }}>

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
          <GlobalButton title='Create a Board' />
        </div>

      </div>
    </>
  );
};

export default Navbar;