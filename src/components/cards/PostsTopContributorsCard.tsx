"use client";

import React, { useState } from "react";

const PostsTopContributorsCard = () => {
  const [selectedCost, setSelectedCost] = useState<string>("$10");

  const costs = ["$10", "$25", "$50", "$100", "$250", "$500", "Custom"];

  return (
    <div className="bg-black p-4 rounded-[24px]">
      <p className="text-white text-[24px] font-bold">Top Contributors</p>

      <div className="flex gap-3 flex-wrap mt-4">
        <p className="border border-[#303030] rounded-full text-white text-sm bg-[#1B1B1B] px-3 py-1">
          Team Crew - <span className="text-[#F71873]">$500</span>
        </p>
        <p className="border border-[#303030] rounded-full text-white text-sm bg-[#1B1B1B] px-3 py-1">
          Mom & Dad - <span className="text-[#F71873]">$300</span>
        </p>
        <p className="border border-[#303030] rounded-full text-white text-sm bg-[#1B1B1B] px-3 py-1">
          Anna - <span className="text-[#F71873]">$250</span>
        </p>
      </div>

      <div className="bg-[#1B1B1B] flex justify-between max-[700px]:justify-start gap-3 p-4 mt-4 rounded-xl flex-wrap">
        {costs.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelectedCost(item)}
            className={`px-5 py-1 rounded-full text-white cursor-pointer transition ${selectedCost === item
              ? "bg-gradient-to-r from-[#E6408A] to-[#8C5AB6]"
              : "bg-[#303030]"
              }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostsTopContributorsCard;
