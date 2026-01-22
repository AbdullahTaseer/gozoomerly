'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlobalButton from '@/components/buttons/GlobalButton';
import { authService } from '@/lib/supabase/auth';
import AuthLayout from '@/components/authLayout/AuthLayout';
import FloatingInput from '@/components/inputs/FloatingInput';
import { Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (loginMode === 'email' && (!email || !password)) {
      setError('Please fill in all fields');
      return;
    }

    if (loginMode === 'phone' && (!phone || !password)) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    const response = loginMode === 'email'
      ? await authService.signInWithEmail({ email, password })
      : await authService.signInWithPhone({ phone, password });

    setLoading(false);

    if (response.success) {
      router.push('/dashboard');
    } else {
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
    <AuthLayout>
      <form onSubmit={handleSignIn} className='max-w-md w-full'>
        <p className='text-center poppin-font text-[36px] font-medium'>Welcome back!</p>
        <p className='text-center font-poppins'>Please login to your account</p>

        {error && (
          <div className='mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm'>
            {error}
          </div>
        )}

        <div className="flex gap-2 my-6">
          <button
            type="button"
            onClick={() => setLoginMode('email')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${loginMode === 'email'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMode('phone')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${loginMode === 'phone'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Phone
          </button>
        </div>

        {loginMode === 'email' ? (
          <FloatingInput
            id={"email"}
            title='Email'
            width='100%'
            height='46px'
            className="mt-4"
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <FloatingInput
            id={"phone"}
            title='Phone Number'
            width='100%'
            height='46px'
            className="mt-4"
            type='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
          />
        )}

        <div className="relative mt-6">
          <FloatingInput
            id={"password"}
            title='Password'
            width='100%'
            height='46px'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSignIn();
              }
            }}
            inputClassName="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black cursor-pointer focus:outline-none"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        <p
          className='text-right font-medium text-sm my-3 cursor-pointer hover:text-pink-600'
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
    </AuthLayout>
  );
};

export default SignIn;
