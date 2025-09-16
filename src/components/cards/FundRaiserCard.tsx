"use client";

import React, { useState } from "react";

const FundRaiserCard = () => {
  const [selectedCost, setSelectedCost] = useState<string>("$10");

  const costs = ["$10", "$25", "$50", "$100", "$250", "$500", "Custom"];
  const raised = 1850;
  const target = 3000;

  const progress = (raised / target) * 100;

  return (
    <div className="bg-black p-6 rounded-[24px]">
  
      <p className="text-white text-[24px] font-bold">
        Let's support <span className="capitalize">sean</span> to get his dream guitar
      </p>

      
      <div className="mt-4">
        <p className="text-white font-semibold">Goal Progress</p>
        <div className="w-full h-[6px] bg-gray-600 rounded-full mt-2">
          <div
            className="h-[6px] rounded-full bg-gradient-to-r from-[#E6408A] to-[#8C5AB6]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-white mt-1">
          <span>Raised: ${raised.toLocaleString()}</span>
          <span>Target: ${target.toLocaleString()}</span>
        </div>
      </div>

    
      <div className="bg-[#1B1B1B] flex justify-between max-[700px]:justify-start gap-3 p-4 mt-6 rounded-xl flex-wrap">
        {costs.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelectedCost(item)}
            className={`px-5 py-2 rounded-full text-white cursor-pointer transition text-sm ${
              selectedCost === item
                ? "bg-gradient-to-r from-[#E6408A] to-[#8C5AB6]"
                : "bg-[#303030]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

    
      <div className="mt-6">
        <p className="text-white text-[18px] font-bold">Top Contributors</p>
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
      </div>
    </div>
  );
};

export default FundRaiserCard;
