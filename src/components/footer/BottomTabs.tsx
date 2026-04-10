"use client";

import { useEffect, useState } from "react";
import { Home, MessageCircle, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { createOrShareModalState } from "@/lib/createOrShareModalState";
import { authService } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";

const defaultTabAvatarSrc =
  typeof ProfileAvatar === "string"
    ? ProfileAvatar
    : (ProfileAvatar as { src?: string }).src || "";

const TabItem = ({ icon, label, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center text-white text-xs gap-1 cursor-pointer"
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default function BottomTabs() {
  const router = useRouter();
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await authService.getUser();
        if (!user || cancelled) return;
        const supabase = createClient();
        const { data } = await supabase
          .from("profiles")
          .select("profile_pic_url")
          .eq("id", user.id)
          .maybeSingle();
        if (cancelled) return;
        const url = data?.profile_pic_url?.trim();
        if (url && url !== "null" && url !== "undefined") {
          setProfilePicUrl(url);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tabProfileSrc = profilePicUrl || defaultTabAvatarSrc;

  return (
    <div className="fixed bottom-0 bg-white left-0 right-0 z-50 hidden max-[769px]:block">

      {/* SVG NAVBAR */}
      <div className="relative">

        <svg
          viewBox="0 0 400 80"
          className="w-full h-[67px] sm:h-[80px]"
          preserveAspectRatio="none"
        >
          <path
            d="
            M0 20
            Q0 0 20 0
            L160 0
            C175 0 175 40 200 40
            C225 40 225 0 240 0
            L380 0
            Q400 0 400 20
            L400 80
            L0 80
            Z"
            fill="#18171f"
          />
        </svg>

        {/* TAB ITEMS */}
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <TabItem
            icon={<Home size={22} />}
            label="Home"
            onClick={() => router.push("/u/home")}
          />

          <TabItem
            icon={<Users size={22} />}
            label="Connections"
            onClick={() => router.push("/u/connections")}
          />

          <div className="w-16" />

          <TabItem
            icon={<MessageCircle size={22} />}
            label="Chats"
            onClick={() => router.push("/u/chat")}
          />

          <TabItem
            icon={
              <img
                src={tabProfileSrc}
                alt=""
                className="w-7 h-7 rounded-full object-cover bg-gray-600"
              />
            }
            label="Profile"
            onClick={() => router.push("/u/profile")}
          />
        </div>

        {/* FLOATING BUTTON */}
        <div className="absolute left-1/2 -top-4 sm:-top-7 -translate-x-1/2">
          <button
            onClick={() => createOrShareModalState.open()}
            className="h-11 w-11 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <Plus size={28} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}