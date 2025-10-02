'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { PlusCircle, Send, ArrowLeft } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import ChatCard from '@/components/cards/ChatCard';
import { chatListData } from '@/lib/MockData';

type Chat = {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string | StaticImageData;
};
const ChatPage = () => {

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className='px-[7%] max-[900px]:px-3 text-white'>
      <div className='px-4 flex items-center justify-between max-[500px]:flex-col gap-2'>
        <TitleCard title='Chat' className='text-left' />
        <div className='relative w-[270px] max-[500px]:mx-auto'>
          <GlobalInput placeholder='Search friends & family...' height='42px' width='100%' borderRadius='100px'/>
        </div>
      </div>

      <div className='flex h-[calc(100vh-190px)] max-[1024px]:h-[calc(100vh-160px)] max-[768px]:h-[calc(100vh-140px)] max-[500px]:h-[calc(100vh-190px)] mt-3'>

        <div className={`w-[350px] max-[900px]:w-full border-black/15 border flex-col overflow-y-auto scrollbar-hide ${selectedChat ? 'max-[900px]:hidden' : 'flex'}`}>
          {chatListData.map(chat => (
            <ChatCard
              key={chat.id}
              imgPath={chat.avatar}
              name={chat.name}
              message={chat.message}
              time={chat.time}
              isActive={selectedChat?.id === chat.id}
              onClick={() => setSelectedChat(chat)}
            />
          ))}
        </div>

        <div className={`flex-1 border border-l-0 flex-col ${selectedChat ? 'flex' : 'max-[900px]:hidden'}`}>
          {selectedChat ? (
            <>
              <div className='flex items-center gap-4 bg-[#2A2D3A] p-4 border-b border-gray-700'>
                <ArrowLeft onClick={() => setSelectedChat(null)} className='cursor-pointer lg:hidden' />
                <Image src={selectedChat.avatar} alt={selectedChat.name} width={40} height={40} className='rounded-full' />
                <p className='font-bold'>{selectedChat.name}</p>
              </div>

              <div className='flex-1 text-sm p-3 overflow-y-auto space-y-4'>
                <div className='text-center my-4'><span className='bg-gray-700 text-xs px-3 py-1 rounded-full'>Today</span></div>
                <div className='flex justify-end'><div className='bg-[#2A2D3A] rounded-lg p-3 max-w-md'>Hi, how are you?</div></div>
                <div className='flex justify-start'><div className='bg-[#F7F7F7] text-black rounded-lg p-3 max-w-md'>I am good thanks.</div></div>
                <div className='flex justify-end'><div className='bg-[#2A2D3A] rounded-lg p-3 max-w-md'>Happy Birthday! Wishing you a day filled with love, laughter, and unforgettable.</div></div>
                <div className='flex justify-start'><div className='bg-[#F7F7F7] text-black rounded-lg p-3 max-w-md'>Thanks!</div></div>
              </div>

              <div className='p-4 bg-[#F7F7F7] flex items-center gap-4'>
                <div className='bg-white p-2 rounded-full'>
                  <PlusCircle size={24} className='text-black cursor-pointer' />
                </div>
                <div className='flex-1'>
                  <GlobalInput placeholder='Write your message...' height='40px' width='100%' borderRadius='100px' bgColor='white' inputClassName="pl-4 pr-12 border-none" />
                </div>
                <button className='bg-white p-3 rounded-full'>
                  <Send size={18} className='text-black' />
                </button>
              </div>
            </>
          ) : (
            <div className="max-[900px]:hidden flex flex-col items-center justify-center h-full text-gray-400">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;