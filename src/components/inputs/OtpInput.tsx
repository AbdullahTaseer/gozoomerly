"use client";
import {  useState, useEffect  } from 'react';

interface OtpInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

const OtpInput = ({ value = '', onChange }: OtpInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));

  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, 6);
      const newOtp = [...new Array(6).fill('')];
      otpArray.forEach((digit, index) => {
        newOtp[index] = digit;
      });
      setOtp(newOtp);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (onChange) {
      onChange(newOtp.join(''));
    }

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index]) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="grid grid-cols-6 space-x-2 my-6">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="h-[65px] text-center outline-none text-3xl border border-[#DADADA] rounded-md focus:outline-none"
        />
      ))}
    </div>
  );
};

export default OtpInput;