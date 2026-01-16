"use client";

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import OtpInput from '@/components/inputs/OtpInput';
import AuthLayout from '@/components/authLayout/AuthLayout';
import GlobalButton from '@/components/buttons/GlobalButton';
import FloatingInput from '@/components/inputs/FloatingInput';
import SignupInfoCard, { type UserInfo } from '@/components/cards/SignupInfoCard';
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import { PartnerRegistrationForm } from '@/components/PartnerRegistrationForm';

import CelebrtionImg from "@/assets/svgs/bomb.svg";
import { ArrowLeft } from 'lucide-react';

const SignupContent = () => {
  const searchParams = useSearchParams();
  
  // Check for referral code in URL
  const referralCode = searchParams.get('referral_code') || 
                       searchParams.get('referralCode') || 
                       searchParams.get('invite_code') || 
                       searchParams.get('inviteCode') || '';
  
  // Get other URL parameters
  const urlParams = {
    email: searchParams.get('email') || '',
    name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || searchParams.get('phoneNumber') || '',
    referralCode: referralCode
  };

  // If referral code exists, show the partner registration form
  if (referralCode) {
    return (
      <AuthLayout>
        <div className="w-full max-w-2xl">
          <PartnerRegistrationForm
            partnerId={4} // Partner ID 4 as requested
            initialValues={urlParams}
            onBack={() => window.history.back()}
          />
        </div>
      </AuthLayout>
    );
  }

  // Otherwise, show the normal signup flow
  return <SignupFlow />;
};

const SignupFlow = () => {

  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  const router = useRouter();

  const progressBar = step === 1 ? 0
    : step === 2 ? 20
      : step === 3 ? 40
        : step === 4 ? 70
          : step === 5 ? 100
            : 0;

  const handleBack = () => {
    if (step !== 1) {
      setStep(step - 1);
      setError('');
    }
  }

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.sendPhoneOTP({ phone: phoneNumber });
      
      if (result.success) {
        setStep(2);
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Just verify OTP and password, we'll update user info later
      const result = await authService.verifyPhoneOTP({
        phone: phoneNumber,
        token: otp,
        password: password
      });
      
      if (result.success) {
        setStep(4);
      } else {
        setError(result.error || 'Failed to verify OTP');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUserInfoSubmit = async (info: UserInfo) => {
    setLoading(true);
    setError('');
    setUserInfo(info);
    
    try {
      // Update user metadata
      const { error } = await authService.updateUserProfile({
        full_name: info.fullName,
        birth_date: info.birthDate,
        country: info.country,
        state: info.state,
        city: info.city,
        avatar_url: info.avatar,
        phone: phoneNumber,
      });
      
      if (error) {
        setError(error);
        return;
      }

      const currentUser = await authService.getUser();
      
      if (currentUser) {
        const supabase = createClient();
        
        const profileData = {
          id: currentUser.id,
          name: info.fullName,
          email: currentUser.email || '',
          phone_number: phoneNumber,
          birth_date: info.birthDate || null,
          country: info.country || null,
          state: info.state || null,
          city: info.city || null,
          bio: null,
          work: null,
          languages: [],
          lives_in: null,
          profile_pic_url: info.avatar || null,
          followers_count: 0,
          following_count: 0,
          boards_created_count: 0,
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }
      
      setStep(5);
    } catch (err) {
      console.error('Error in signup:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };


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
          <FloatingInput 
            id={"phone-number"} 
            title='Phone Number' 
            type='tel' 
            width='100%' 
            className="my-6"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
          <GlobalButton 
            title='Continue' 
            height='50px' 
            onClick={handleSendOTP}
            disabled={loading || !phoneNumber}
          />
        </div>
      }

      {step === 2 &&
        <div className='max-w-lg w-full mt-6'>
          <p className='text-center poppin-font text-[36px] font-medium'>We just sent an SMS</p>
          <p className='text-center font-poppins'>Enter the security code we sent to <br /> {phoneNumber}</p>
          <OtpInput value={otp} onChange={setOtp} />
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
          <GlobalButton 
            title='Continue' 
            height='50px' 
            onClick={() => setStep(3)}
            disabled={loading || otp.length < 6}
          />
        </div>
      }

      {step === 3 &&
        <div className='max-w-lg w-full mt-6'>
          <p className='text-center poppin-font text-[36px] font-medium'>Set your password</p>
          <p className='text-center font-poppins'>Please enter password</p>
          <FloatingInput 
            id={"Password"} 
            title='Password' 
            type='password' 
            width='100%' 
            className="my-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FloatingInput 
            id={"Re-enter Password"} 
            title='Re-enter Password' 
            type='password' 
            width='100%' 
            className="mb-6"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
          <GlobalButton 
            title='Continue' 
            height='50px' 
            onClick={handleVerifyOTP}
            disabled={loading || !password || !confirmPassword}
          />
        </div>
      }

      {step === 4 && <div className='max-w-lg w-full mt-6'>
        <p className='text-center poppin-font text-[36px] font-medium'>Enter your info</p>
        <p className='text-center font-poppins'>Please enter your information</p>
        {error && <p className='text-red-500 text-sm text-center mb-4'>{error}</p>}
        <SignupInfoCard continueClick={handleUserInfoSubmit} />
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

const Signup = () => {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E3418B]"></div>
        </div>
      </AuthLayout>
    }>
      <SignupContent />
    </Suspense>
  );
};

export default Signup;
