import React, { useState } from 'react';
import ArrowRight from "@/assets/svgs/ArrowRight.svg";
import GlobalButton from '../buttons/GlobalButton';

type props = {
  goToLiveBoard: () => void;
}

const WhoCanJoin = ({ goToLiveBoard }: props) => {

  const [join, setJoin] = useState("1");
  const data = [
    { id: "1", heading: "Anyone with the link", desc: "Anyone who gets this link can view and join this board." },
    { id: "2", heading: "Only invited people", desc: "Only the people you invite can join and contribute." },
    { id: "3", heading: "Anyone invited can invite others", desc: "Anyone on your invited list can also share the invite with others." },
  ];

  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 mx-auto space-y-6">
      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Who can join? 🔐
        </p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Choose how people can access and contribute to this birthday board.
        </p>
      </div>

      <div className='mt-6 space-y-3'>
        {data.map((item) => (
          <div key={item.id} onClick={() => setJoin(item.id)} className='flex gap-3 cursor-pointer border rounded-md p-4 border-[#B2B2B2]'>
            <div className={`h-2 w-2 rounded-full shrink-0 ${join === item.id ? "bg-black" : "bg-white"} mt-2`} />
            <div>
              <p className='font-medium'>{item.heading}</p>
              <p className='text-sm mt-1'>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <GlobalButton
        title="Next"
        icon={ArrowRight}
        height="44px"
        className="flex-row-reverse mt-6"
        onClick={goToLiveBoard}
      />

    </div>
  );
};

export default WhoCanJoin;