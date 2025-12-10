"use client";
import React, { useState } from "react";

const TABS = [
  { id: "wishes", label: "Wishes" },
  { id: "gifts", label: "Gifts" },
  { id: "memories", label: "Memories" },
  { id: "chats", label: "Chats (8)" },
];

interface BoardSlugTabsCardProps {
  wishesChildren?: React.ReactNode;
  giftsChildren?: React.ReactNode;
  memoriesChildren?: React.ReactNode;
  chatsChildren?: React.ReactNode;
}

const BoardSlugTabsCard = ({
  wishesChildren,
  giftsChildren,
  memoriesChildren,
  chatsChildren,
}: BoardSlugTabsCardProps) => {
  const [activeTab, setActiveTab] = useState("wishes");

  return (
    <div className="bg-white max-w-[1100px] mx-auto p-4 pb-0">
      <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-[24px] max-[768px]:text-[18px] whitespace-nowrap font-semibold transition-all
              ${activeTab === tab.id
                  ? "text-black border-b-2 border-black"
                  : "text-black"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "wishes" && <>{wishesChildren}</>}
        {activeTab === "gifts" && <>{giftsChildren}</>}
        {activeTab === "memories" && <>{memoriesChildren}</>}
        {activeTab === "chats" && <>{chatsChildren}</>}
      </div>
    </div>
  );
};

export default BoardSlugTabsCard;
