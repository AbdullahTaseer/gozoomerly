import React from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Plus } from "lucide-react";

type props = {
  imgPath: string | StaticImport;
  profileName: string;
  showAddBtn?: boolean
}

const AvatarCard = ({ imgPath, profileName, showAddBtn = false }: props) => {
  return (
    <div className=''>
      <div className={`${showAddBtn ? "" : 'border-2'} w-[90px] h-[90px] shrink-0 flex justify-center items-center relative rounded-full border-[#F43C83]`}>
        <Image src={imgPath} alt={profileName} height={80} width={80} className='rounded-full' />
        {showAddBtn &&
          <div className='absolute p-[2px] cursor-pointer border-white border-2 bottom-2 right-1 bg-gradient-to-r from-[#F43C83] to-[#845CBA] rounded-full text-white'>
            <Plus size={15} />
          </div>
        }
      </div>
      <p className='text-center mt-1 text-sm whitespace-nowrap font-medium'>{profileName}</p>
    </div>
  );
};

export default AvatarCard;