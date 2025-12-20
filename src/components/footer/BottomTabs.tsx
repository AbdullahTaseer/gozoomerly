"use client";

import { Home, Layers, MessageCircle, Plus, UserPlus } from "lucide-react";
import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createOrShareModalState } from '@/lib/createOrShareModalState';

type TabItemProps = {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
};

const TabItem = ({ icon, label, active, onClick }: TabItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-center items-center gap-1 cursor-pointer select-none"
    >
      <div className={active ? "text-white" : "text-white"}>
        {icon}
      </div>
      <span className={`text-xs ${active ? "text-white" : "text-white"}`}>
        {label}
      </span>
    </div>
  );
};

const BottomTabs = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-[769px]:block hidden">
      <div className="relative w-full">

        <div className="h-[70px] bg-[#18171f] rounded-t-3xl flex items-center justify-between px-8 max-[380px]:px-4 shadow-xl">

          <div className="relative">
            <TabItem
              icon={<Layers size={22} />}
              label="Boards"
              active={pathname.startsWith("/dashboard/allBoards")}
              onClick={() => router.push("/dashboard/allBoards")}
            />

            <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </div>

          <TabItem
            icon={<UserPlus />}
            label="Connections"
            active={pathname === "/dashboard/connections"}
            onClick={() => router.push("/dashboard/connections")}
          />

          <div className="w-12" />

          <TabItem
            icon={<MessageCircle size={22} />}
            label="Chat"
            active={pathname.startsWith("/dashboard/chat")}
            onClick={() => router.push("/dashboard/chat")}
          />

          <div
            onClick={() => router.push("/dashboard/profile")}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-7 h-7 rounded-full"
            />
            <span
              className={`text-xs ${pathname.startsWith("/dashboard/profile")
                ? "text-white"
                : "text-gray-400"
                }`}
            >
              Profile
            </span>
          </div>
        </div>

        <div className="absolute left-1/2 -top-8 -translate-x-1/2">
          <button
            onClick={() => createOrShareModalState.open()}
            className="w-16 h-16 max-[380px]:h-14 max-[380px]:w-14 rounded-full border-5 max-[380px]:border-4 border-white bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <Plus color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};


export default BottomTabs;
