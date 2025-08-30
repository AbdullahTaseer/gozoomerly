import React from 'react';
import Image from 'next/image';
import GlobalButton from '../buttons/GlobalButton';
import AddWishImg from "@/assets/svgs/add-wish.svg";
import CloudUpload from "@/assets/svgs/upload-cloud.svg";

type props = {
  uploaderModalClick: () => void;
}

const AddYourWish = ({ uploaderModalClick }: props) => {
  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 mx-auto space-y-4">
      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Add your wish 💌
        </p>
        <p className="text-sm text-center mt-1">
          Make it personal your photos, videos, and voice will be part of their forever memory Photos
        </p>
      </div>
      <div className='mt-16'>
        <Image src={AddWishImg} alt='' className='mx-auto' />
        <p className="text-sm text-center mt-3">Drag photos and videos here</p>
      </div>
      <GlobalButton onClick={uploaderModalClick} title="Upload Media" icon={CloudUpload} height='44px' className='mt-10 w-[240px] mx-auto' />
    </div>
  );
};

export default AddYourWish;