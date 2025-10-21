"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authService } from '@/lib/supabase/auth';
import { getBoardTypes, BoardType } from '@/lib/supabase/boards';

import AppLogo from "@/assets/svgs/Zoomerly.svg";
import Particles from "@/assets/svgs/why-people-love-particles.svg";

// Import default images for board types
import Compaign_1 from "@/assets/svgs/compaign/compaign-1.svg";
import Compaign_2 from "@/assets/svgs/compaign/compaign-2.svg";
import Compaign_3 from "@/assets/svgs/compaign/compaign-3.svg";
import Compaign_4 from "@/assets/svgs/compaign/compaign-4.svg";
import Compaign_5 from "@/assets/svgs/compaign/compaign-5.svg";
import Compaign_6 from "@/assets/svgs/compaign/compaign-6.svg";
import Compaign_7 from "@/assets/svgs/compaign/compaign-7.svg";
import Compaign_8 from "@/assets/svgs/compaign/compaign-8.svg";
import Compaign_9 from "@/assets/svgs/compaign/compaign-9.svg";

const defaultImages = [
  Compaign_1, Compaign_2, Compaign_3, Compaign_4, 
  Compaign_5, Compaign_6, Compaign_7, Compaign_8, Compaign_9
];

const Compaign = () => {

  const router = useRouter();
  const [boardTypes, setBoardTypes] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
    fetchBoardTypes();
  }, []);
  
  const checkAuth = async () => {
    const user = await authService.getUser();
    if (!user) {
      router.push('/signin');
    }
  };
  
  const fetchBoardTypes = async () => {
    try {
      const { data, error } = await getBoardTypes();
      if (data && !error) {
        setBoardTypes(data);
      }
    } catch (err) {
      console.error('Error fetching board types:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCampaignSelect = (boardType: BoardType) => {
    console.log('Board type selected:', boardType);
    
    // Store the selected board type info
    const boardTypeData = {
      id: boardType.id,
      name: boardType.name,
      slug: boardType.slug
    };
    
    localStorage.setItem('selectedBoardType', JSON.stringify(boardTypeData));
    console.log('Stored in localStorage:', boardTypeData);
    
    // Navigate to the creation page
    console.log('Navigating to /createBirthdayBoard');
    router.push('/createBirthdayBoard');
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white p-6">

      <Image onClick={() => router.push("/")} src={AppLogo} alt="App Logo" className="cursor-pointer relative z-30" />
      <Image src={Particles} alt="" className="absolute top-10 left-10 z-0" />
      <Image src={Particles} alt="" className="absolute bottom-10 right-10 z-0" />

      <h2 className="mt-4 sm:mt-12 text-center text-[32px] max-[700px]:text-[24px] font-bold">
        What Are You Celebrating?
      </h2>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="text-lg">Loading campaign types...</div>
        </div>
      ) : boardTypes.length === 0 ? (
        <div className="flex justify-center items-center mt-20">
          <div className="text-lg text-gray-500">No campaign types available</div>
        </div>
      ) : (
        <div className="mt-4 sm:mt-10 relative z-10 grid max-[520px]:grid-cols-1 max-[768px]:grid-cols-2 max-[1024px]:grid-cols-3 grid-cols-4 gap-6 w-full mx-auto max-w-6xl">
          {boardTypes.map((boardType, i) => (
            <div
              key={boardType.id}
              onClick={() => handleCampaignSelect(boardType)}
              className="bg-black rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer relative z-20"
            >
              <div className="relative w-full h-[180px]">
                {/* Use default images based on index, or a placeholder */}
                <Image 
                  src={defaultImages[i % defaultImages.length]} 
                  alt={boardType.name} 
                  fill 
                  className="object-cover" 
                />
                {/* Show the board type icon if available */}
                {boardType.icon && (
                  <div className="absolute top-2 right-2 text-white text-2xl">
                    {boardType.icon}
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white text-center font-bold">{boardType.name}</p>
                {boardType.description && (
                  <p className="text-gray-300 text-center text-sm mt-1">{boardType.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Compaign;