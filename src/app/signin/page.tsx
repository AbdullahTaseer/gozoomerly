'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Background from "@/assets/svgs/hero-bg-img.svg";
import WhiteLogo from "@/assets/svgs/Zoomerly-white.svg";
import GlobalInput from '@/components/inputs/GlobalInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import { authService } from '@/lib/supabase/auth';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    const response = await authService.signInWithEmail({
      email,
      password,
    });

    console.log("Sign in response:", response);

    setLoading(false);

    if (response.success) {
      console.log("Sign in successful, redirecting...");
      router.push('/');
    } else {
      console.log("Sign in failed:", response.error);
      setError(response.error || 'Sign in failed');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    setLoading(true);
    const response = await authService.resetPassword(email);
    setLoading(false);

    if (response.success) {
      alert(response.data?.message || 'Password reset email sent');
    } else {
      setError(response.error || 'Failed to send reset email');
    }
  };

  return (
    <div className='flex h-screen'>
      <div className='w-[45%] max-[768px]:hidden relative flex justify-center items-center'>
        <Image src={Background} alt='Background' fill className='object-cover' />
        <div className='bg-black/50 absolute inset-0' />
        <Image src={WhiteLogo} alt='' className='relative' />
      </div>
      <div className='w-[55%] max-[768px]:w-full flex justify-center items-center p-4'>
        <form onSubmit={handleSignIn} className='max-w-md w-full'>
          <p className='text-center poppin-font text-[36px] font-medium'>Welcome back!</p>
          <p className='text-center font-poppins'>Please login to your account</p>
          
          {error && (
            <div className='mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm'>
              {error}
            </div>
          )}
          
          <GlobalInput 
            title='' 
            width='100%' 
            height='46px' 
            className="mt-10" 
            placeholder='Email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <GlobalInput 
            title='' 
            width='100%' 
            height='46px' 
            className="mt-6" 
            placeholder='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSignIn();
              }
            }}
          />
          
          <p 
            className='text-right font-medium text-sm my-3 cursor-pointer hover:text-blue-600'
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </p>
          
          <GlobalButton 
            title={loading ? 'Signing in...' : 'Continue'} 
            height='46px' 
            onClick={handleSignIn}
            className={loading ? 'opacity-50 cursor-not-allowed' : ''}
          />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
