'use client';

import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';

const data = [
  {
    title: 'Notification title',
    time: '12:34 am, Today'
  },
  {
    title: 'Notification title',
    time: '12:34 am, Today'
  },
  {
    title: 'Notification title',
    time: '12:34 am, Today'
  },
  {
    title: 'Notification title',
    time: '12:34 am, Today'
  },
  {
    title: 'Notification title',
    time: '12:34 am, Today'
  },
  {
    title: 'Notification title',
    time: '12:34 am, Today'
  },
  {
    title: 'Notification title',
    time: '12:34 am, Today'
  },
  {
    title: 'Notification title',
    time: '12:34 am, Today'
  },
  {
    title: 'Notification title',
    time: '12:34 am, Today'
  },
]

const Notifications = () => {
  const router = useRouter();

  return (
    <div className="text-black">
      <DashNavbar />
      <MobileHeader
        title="Notifications"
        showBack
        onBackClick={() => router.push('/u/home')}
      />

      <div className="px-[5%] max-[768px]:px-4 py-5">
        <div className="max-[769px]:hidden flex justify-between items-center mb-6">
          <span className="text-3xl font-bold">Notifications</span>
        </div>

        {data.map(({ title, time }, i) => (
          <div key={i} className='bg-[#F7F7F7] p-4 flex items-center gap-4 rounded-[8px] mt-4'>
            <div className='bg-white rounded-full p-2'>
              <Star />
            </div>
            <div>
              <p className='text-[24px] max-[768px]:text-[20px]'>{title}</p>
              <p className='text-xs'>{time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;