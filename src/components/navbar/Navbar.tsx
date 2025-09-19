'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { X } from 'lucide-react';
import AppLogo from "@/assets/svgs/Zoomerly.svg";
import MenuIcon from "@/assets/svgs/menu-icon.svg";
import AnimatedButton from '../buttons/AnimatedButton';

const mobileOptions = ["Home", "Why Zoomerly Exists", "Have a question?", "Sign up"];
const desktopOptions = ["Home", "Why Zoomerly Exists", "Have a question?", "Sign up"];

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
      <div className='flex justify-between items-center gap-3 px-[5%] max-[769px]:px-4 pb-4 pt-6 max-[1024px]:pb-3 max-[1024px]:pt-4 bg-white sticky top-0 z-[100]'>
        <Image
          className='hidden max-[900px]:block cursor-pointer'
          src={MenuIcon}
          alt='Menu'
          height={20}
          width={20}
          onClick={() => setIsSidebarOpen(true)}
        />
        <Image src={AppLogo} onClick={() => router.push("/")} alt="Logo" className='w-[140px] max-[900px]:w-[123px] cursor-pointer' />
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

export default Navbar;