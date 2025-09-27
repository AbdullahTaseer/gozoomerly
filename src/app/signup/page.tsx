"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import OtpInput from '@/components/inputs/OtpInput';
import AuthLayout from '@/components/authLayout/AuthLayout';
import GlobalButton from '@/components/buttons/GlobalButton';
import FloatingInput from '@/components/inputs/FloatingInput';
import SignupInfoCard from '@/components/cards/SignupInfoCard';

import CelebrtionImg from "@/assets/svgs/bomb.svg";
import { ArrowLeft } from 'lucide-react';

const Signup = () => {

  const [step, setStep] = useState(1);
  const router = useRouter();

  const progressBar = step === 1 ? 0
    : step === 2 ? 20
      : step === 3 ? 40
        : step === 4 ? 70
          : step === 5 ? 100
            : 0;

  const handleBack = () => {
    if (step !== 1) {
      setStep(step - 1)
    }
  }


  return (
    <AuthLayout>

      {step !== 5 &&
        <div className='w-full mt-6 max-w-lg'>
          <div className='w-full flex gap-3 items-center'>
            <ArrowLeft className={`shrink-0 ${step === 1 ? "cursor-not-allowed" : "cursor-pointer"}`} color='black' onClick={handleBack} />
            <div className='h-1.5 w-full rounded-full bg-gray-200 overflow-hidden'>
              <div className='h-1.5 bg-[#E3418B] duration-700' style={{ width: `${progressBar}%` }} />
            </div>
          </div>
          <p className='pl-[35px]'>{progressBar}% Complete</p>
        </div>
      }

      {step === 1 &&
        <div className='max-w-lg w-full mt-6'>
          <p className='text-center poppin-font text-[36px] font-medium'>What&apos;s your phone number</p>
          <p className='text-center font-poppins'>We&apos;ll phone you a code to verify your identity.</p>
          <FloatingInput id={"phone-number"} title='Phone Number' type='tel' width='100%' className="my-6" />
          <GlobalButton title='Continue' height='50px' onClick={() => setStep(2)} />
        </div>
      }

      {step === 2 &&
        <div className='max-w-lg w-full mt-6'>
          <p className='text-center poppin-font text-[36px] font-medium'>We just sent an SMS</p>
          <p className='text-center font-poppins'>Enter the security code we sent to <br /> +32 123456789</p>
          <OtpInput />
          <GlobalButton title='Continue' height='50px' onClick={() => setStep(3)} />
        </div>
      }

      {step === 3 &&
        <div className='max-w-lg w-full mt-6'>
          <p className='text-center poppin-font text-[36px] font-medium'>Set your password</p>
          <p className='text-center font-poppins'>Please enter password</p>
          <FloatingInput id={"Password"} title='Password' type='password' width='100%' className="my-6" />
          <FloatingInput id={"Re-enter Password"} title='Re-enter Password' type='password' width='100%' className="mb-6" />
          <GlobalButton title='Continue' height='50px' onClick={() => setStep(4)} />
        </div>
      }

      {step === 4 && <div className='max-w-lg w-full mt-6'>
        <p className='text-center poppin-font text-[36px] font-medium'>Enter your info</p>
        <p className='text-center font-poppins'>Please enter your information</p>
        <SignupInfoCard continueClick={() => setStep(5)} />
      </div>
      }

      {step === 5 &&
        <>
          <div />
          <div className='max-w-lg w-full'>
            <Image src={CelebrtionImg} alt="" height={120} width={120} className='mx-auto mb-5' />
            <p className='text-center poppin-font text-[36px] font-medium'>All done</p>
            <p className='text-center font-poppins'>Your account has been created. You're now ready to explore and enjoy all the features and benefits we have to offer.</p>
            <GlobalButton title='Create a Board' height='50px' className='mt-6' onClick={() => router.push("/")} />
          </div>
        </>
      }

    </AuthLayout>
  );
};

export default Signup;
