'use client'
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import AppLogo from "@/assets/svgs/Zoomerly.svg";
import AnimatedButton from '../buttons/AnimatedButton';
import BellIconIndicator from '../cards/BellIconIndicator';
import { createOrShareModalState } from '@/lib/createOrShareModalState';

const desktopOptions = ["Home", "Boards", "Pro", "Chat", "Circles", "Connections", "Profile"];

type props = {
  hide?: boolean;
}

const DashNavbar = ({ hide = true }: props) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (option: string) => {
    if (option === "Home") {
      return pathname === "/dashboard/home";
    }
    if (option === "Boards") {
      return pathname === "/dashboard/allBoards";
    }
    if (option === "Pro") {
      return pathname === ("/dashboard/proScreen");
    }
    if (option === "Chat") {
      return pathname === "/dashboard/chat";
    }
    if (option === "Circles") {
      return pathname === "/dashboard/circles";
    }
    if (option === "Connections") {
      return pathname === "/dashboard/connections";
    }
    if (option === "Profile") {
      return pathname === "/dashboard/profile";
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
      case "Pro":
        router.push("/dashboard/proScreen");
        break;
      case "Chat":
        router.push("/dashboard/chat");
        break;
      case "Circles":
        router.push("/dashboard/circles");
        break;
      case "Connections":
        router.push("/dashboard/connections");
        break;
      case "Profile":
        router.push("/dashboard/profile");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className={`${hide ? "max-[769px]:hidden" : ""} flex justify-between items-center gap-3 px-[5%] max-[769px]:px-4 pb-4 pt-4 max-[1024px]:pb-3 bg-white sticky shadow-sm top-0 z-[100]`}>
        <Image src={AppLogo} onClick={() => router.push("/dashboard")} alt="Logo" className='w-[140px] max-[900px]:w-[123px] cursor-pointer' />
        <div className='flex items-center gap-6 max-[900px]:gap-4 max-[769px]:hidden'>
          {desktopOptions.map((option, i) => (
            <p
              key={i}
              className={`text-[16px] cursor-pointer transition-all duration-300 ${getActiveStyles(option)}`}
              onClick={() => handleNavigation(option)}
            >
              {option}
            </p>
          ))}
          <AnimatedButton onClick={() => createOrShareModalState.open()} height='42px' title='Create' width='110px' />
        </div>
        <div className='hidden max-[769px]:block'>
          <BellIconIndicator />
        </div>
      </div>
    </>
  );
};

export default DashNavbar;