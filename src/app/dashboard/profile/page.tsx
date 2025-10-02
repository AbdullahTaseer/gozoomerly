import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Bio from "@/assets/svgs/bio.svg";
import Friends from "@/assets/svgs/friends.svg";
import {
  Bell,
  ChevronRight,
  LockKeyhole,
  Mail,
  Trash2,
  UserLock,
  Smartphone,
} from 'lucide-react';
import Activity from "@/assets/svgs/activity.svg";
import TitleCard from '@/components/cards/TitleCard';
import BoardsIcon from "@/assets/svgs/board-icon.svg";
import MyContributors from "@/assets/svgs/coins 1.svg";
import MyMemories from "@/assets/svgs/memory-icon.svg";
import MastercardImg from "@/assets/svgs/Mastercard.svg";
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg"
import Particles from "@/assets/svgs/why-people-love-particles.svg";
import PaymentMethodCard from '@/components/cards/PaymentMethodCard';
import * as Switch from '@radix-ui/react-switch';

const Profile = () => {
  const menuItems = [
    { label: "Memories", icon: MyMemories, href: '/dashboard/memories' },
    { label: "Boards", icon: BoardsIcon, href: '/dashboard/boards' },
    { label: "My Contributions", icon: MyContributors, href: '/dashboard/myContributors' },
    { label: "Share with friends", icon: Friends, href: '/dashboard/friends' },
    { label: "Bio", icon: Bio, href: '/dashboard/bio' },
    { label: "Activity", icon: Activity, href: '/dashboard/activity' },
  ];

  return (
    <div className='px-[7%] max-[768px]:px-6'>

      {/* Header */}
      <div className='flex items-center justify-between gap-3'>
        <TitleCard title='Profile' className='text-left' />
        <div className='relative'>
          <Bell />
          <span className='p-1 absolute top-0 right-0 rounded-full bg-pink-500' />
        </div>
      </div>

      {/* Profile Card */}
      <div className='bg-[#1B1D26] p-16 max-[1100px]:p-10 mt-4 relative rounded-[24px] overflow-hidden grid grid-cols-5 max-[900px]:grid-cols-3 gap-4'>
        <Image src={Particles} alt="" className='absolute object-cover' />
        <div className='flex items-center max-[420px]:flex-col gap-3 col-span-2 max-[900px]:col-span-3'>
          <Image src={ProfileAvatar} alt='' height={90} width={90} className='rounded-full' />
          <span>
            <p className='text-white text-[24px] font-bold'>Alex Johnson</p>
            <p className='text-[#F0F0F0] text-sm'>Birthday on 12jun</p>
            <p className='text-[#F0F0F0] text-sm'>Austin,Texas,United States</p>
          </span>
        </div>
        <span className='my-auto'>
          <p className='text-white text-[24px] font-bold'>4</p>
          <p className='text-[#F0F0F0] text-sm'>Compaigns</p>
        </span>
        <span className='my-auto'>
          <p className='text-white text-[24px] font-bold'>40</p>
          <p className='text-[#F0F0F0] text-sm'>Follower</p>
        </span>
        <span className='my-auto'>
          <p className='text-white text-[24px] font-bold'>30</p>
          <p className='text-[#F0F0F0] text-sm'>Following</p>
        </span>
      </div>

      {/* Menu List */}
      <div className='mt-4 bg-white border-b pb-4'>
        {menuItems.map((item, idx) => (
          <Link key={idx} href={item.href} className='flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100'>
            <div className='flex items-center gap-3'>
              <Image src={item.icon} alt='' width={20} height={20} />
              <span className='text-gray-800 font-medium'>{item.label}</span>
            </div>
            <ChevronRight className='text-[#8A8A8A]' size={22} />
          </Link>
        ))}
      </div>

      {/* Payment Method */}
      <div className='py-4 border-b'>
        <div className='flex justify-between gap-3 items-center mb-2'>
          <p className='text-[20px] font-semibold'>Payment Method</p>
          <Link href='/dashboard/paymentMethod' className='cursor-pointer hover:text-pink-500'>Change</Link>
        </div>
        <PaymentMethodCard
          showRadio={false}
          cardImg={MastercardImg}
          cardName='Mastercard'
          cardNumber='**** 5930'
        />
      </div>

      {/* Notification Settings */}
      <div className='py-4 border-b'>
        <p className='text-[20px] font-semibold mb-3'>Notification Settings</p>
        <div className='flex items-center justify-between px-1 py-2'>
          <div className='flex items-center gap-3'>
            <Bell size={20} />
            <span className='text-gray-800'>In-app Notifications</span>
          </div>
          <Switch.Root defaultChecked className="w-11 h-6 bg-[#0D0C10] rounded-full relative data-[state=checked]:bg-pink-500">
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5.5" />
          </Switch.Root>
        </div>
        <div className='flex items-center justify-between px-1 py-2'>
          <div className='flex items-center gap-3'>
            <Smartphone size={20} />
            <span className='text-gray-800'>SMS Notifications</span>
          </div>
          <Switch.Root className="w-11 h-6 rounded-full bg-[#0D0C10] relative data-[state=checked]:bg-pink-500">
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5.5" />
          </Switch.Root>
        </div>
      </div>

      {/* Account Settings */}
      <div className='py-4 border-b'>
        <p className='text-[20px] font-semibold mb-3'>Account Settings</p>
        <div className='flex items-center justify-between px-1 py-2 cursor-pointer hover:bg-gray-100'>
          <div className='flex items-center gap-3'>
            <Mail size={20} />
            <span className='text-gray-800'>Email</span>
          </div>
          <ChevronRight className='text-[#8A8A8A]' size={22} />
        </div>
        <div className='flex items-center justify-between px-1 py-2 cursor-pointer hover:bg-gray-100'>
          <div className='flex items-center gap-3'>
            <LockKeyhole size={20} />
            <span className='text-gray-800'>Password reset</span>
          </div>
          <ChevronRight className='text-[#8A8A8A]' size={22} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className='py-4'>
        <div className='flex items-center gap-3 px-1 py-2 cursor-pointer hover:bg-gray-100'>
          <Trash2 size={20} className='text-red-500' />
          <span className='text-red-500'>Delete Account</span>
        </div>
        <div className='flex items-center gap-3 px-1 py-2 cursor-pointer hover:bg-gray-100'>
          <UserLock size={20} />
          <span className='text-gray-800'>Log out</span>
        </div>
      </div>

    </div>
  );
};

export default Profile;
