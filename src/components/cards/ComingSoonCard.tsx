'use client';

import React, { useState, useEffect } from 'react';
import GlobalButton from '@/components/buttons/GlobalButton';

const ComingSoonCard: React.FC = () => {
  const launchDate = new Date('2026-01-10T00:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const [email, setEmail] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const distance = launchDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          ),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // update every minute

    return () => clearInterval(interval);
  }, [launchDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const handleNotifyMe = () => {
    if (!email) return;
    alert("Thank you! We'll notify you when we launch.");
    setEmail('');
  };

  const TimerBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        {formatNumber(value)
          .split('')
          .map((digit, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-4 md:px-4 md:py-6"
            >
              <span className="text-3xl md:text-4xl font-bold text-black">
                {digit}
              </span>
            </div>
          ))}
      </div>
      <span className="text-sm md:text-base mt-2 font-medium text-black">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center px-4 max-w-2xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
        Coming Soon
      </h1>

      {/* Countdown */}
      <div className="flex items-center gap-4 md:gap-6 mb-8">
        <TimerBox value={timeLeft.days} label="DAYS" />
        <TimerBox value={timeLeft.hours} label="HOURS" />
        <TimerBox value={timeLeft.minutes} label="MINUTES" />
      </div>

      <p className="text-base md:text-lg text-black mb-8 text-center">
        We'll keep you updated on our launch progress.
      </p>

      {/* Email */}
      <div className="w-full max-w-sm">
        <div className="flex items-center bg-white border border-black rounded-lg overflow-hidden">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNotifyMe()}
            className="w-full h-12 px-4 outline-none text-black bg-transparent"
          />

          <GlobalButton
            title="Notify Me"
            height="48px"
            width="120px"
            bgColor="#2D2D2D"
            color="white"
            borderRadius="0"
            onClick={handleNotifyMe}
          />
        </div>
      </div>
    </div>
  );
};

export default ComingSoonCard;
