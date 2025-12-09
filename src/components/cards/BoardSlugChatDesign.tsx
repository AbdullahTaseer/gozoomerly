import React from "react";
import Image from "next/image";
import DummyAvatar from "@/assets/svgs/chat-avatar-1.svg";

import { Send, Plus } from "lucide-react";

const BoardSlugChatDesign = () => {

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center overflow-hidden">
      <div className="py-4">
        <span className="px-4 py-1 text-sm bg-neutral-900 text-white rounded-full">Today</span>
      </div>

      <div className="flex-1 w-full max-w-4xl overflow-y-auto px-6 space-y-10">
        <div className="flex justify-end">
          <div className="max-w-sm bg-neutral-900 text-white px-4 py-3 rounded-xl">
            Hi, how are you?
          </div>
        </div>
        <p className="text-xs text-gray-400 text-right pr-6 -mt-2">8:58 PM</p>

        <div className="flex items-start gap-3">
          <div>
            <div className="flex items-center gap-3">
              <Image src={DummyAvatar} className="h-10 w-10 rounded-full" alt="img" />
              <p className="text-sm font-semibold">John</p>
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-xl mt-1 max-w-sm">
              I am good thanks.
            </div>
            <p className="text-xs text-gray-400 mt-1">9:00 PM</p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-sm bg-neutral-900 text-white px-4 py-3 rounded-xl">
            🎉 Happy Birthday! Wishing you a day filled with love, laughter, and unforgettable.
          </div>
        </div>
        <p className="text-xs text-gray-400 text-right pr-6 -mt-2">9:10 PM</p>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Image src={DummyAvatar} className="h-10 w-10 rounded-full" alt="img" />
            <p className="text-sm font-semibold">Maria</p>
          </div>
          <div className="bg-gray-100 px-4 py-3 rounded-xl mt-1 max-w-sm">
            Thanks!
          </div>
          <p className="text-xs text-gray-400 mt-1">9:30 PM</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Image src={DummyAvatar} className="h-10 w-10 rounded-full" alt="img" />
            <p className="text-sm font-semibold">Alex</p>
          </div>
          <div className="bg-gray-100 px-4 py-3 rounded-xl mt-1 max-w-sm">
            🎉 Happy Birthday! Wishing you a day filled with love, laughter, and unforgettable.
          </div>
          <p className="text-xs text-gray-400 mt-1">9:30 PM</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Image src={DummyAvatar} className="h-10 w-10 rounded-full" alt="img" />
            <p className="text-sm font-semibold">Alex Johnson</p>
          </div>
          <div className="bg-gray-100 px-4 py-3 rounded-xl mt-1 max-w-sm">
            🎉 Happy Birthday! Wishing you a day filled with love, laughter, and unforgettable.
          </div>
          <p className="text-xs text-gray-400 mt-1">9:30 PM</p>
        </div>
      </div>

      <div className="w-full border-t bg-[#F7F7F7] p-4 flex items-center gap-3">
        <button className="w-10 h-10 shrink-0 bg-white flex items-center cursor-pointer justify-center rounded-full text-lg">
          <Plus />
        </button>
        <input
          placeholder="Write your message.."
          className="flex-1 bg-white rounded-full px-4 py-3 outline-0"
        />
        <div className="rounded-full shrink-0 bg-white w-10 h-10 cursor-pointer flex items-center justify-center">
          <Send size={18} />
        </div>
      </div>
    </div>
  );
}


export default BoardSlugChatDesign;