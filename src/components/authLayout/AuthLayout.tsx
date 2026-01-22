import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Background from "@/assets/svgs/hero-bg-img.svg";
import WhiteLogo from "@/assets/svgs/Zoomerly-white.svg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter();

  return (
    <div className='flex h-screen'>
      <div className='w-[45%] max-[768px]:hidden relative flex justify-center items-center'>
        <Image src={Background} alt='Background' fill className='object-cover' />
        <div className='bg-black/50 absolute inset-0' />
        <Image onClick={() => router.push("/")} src={WhiteLogo} alt='' className='relative cursor-pointer' />
      </div>
      <div className='w-[55%] overflow-y-auto relative max-[768px]:w-full flex flex-col justify-center items-center p-4'>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
