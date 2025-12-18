import TitleCard from '@/components/cards/TitleCard';
import { Star } from 'lucide-react';
import React from 'react';

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
  return (
    <div className='px-[7%] max-[768px]:px-6 pb-4'>

      <div className='flex items-center justify-between gap-3'>
        <TitleCard title='Notifications' className='text-left' />
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
  );
};

export default Notifications;