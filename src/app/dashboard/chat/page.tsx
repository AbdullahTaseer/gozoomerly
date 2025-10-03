'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { PlusCircle, Send, ArrowLeft } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import ChatCard from '@/components/cards/ChatCard';
import { chatListData } from '@/lib/MockData';
import ZoomerlyLogo from "@/assets/svgs/Zoomerly.svg";

type Chat = {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string | StaticImageData;
};

type Message = {
  id: number;
  sender: "me" | "other";
  text?: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
};

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "me", text: "Hi, how are you?" },
    { id: 2, sender: "other", text: "I am good thanks." },
    { id: 3, sender: "me", text: "Happy Birthday! 🎉 Wishing you a day filled with love, laughter, and unforgettable moments." },
    { id: 4, sender: "other", text: "Thanks!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;

    setMessages(prev => [
      ...prev,
      { id: prev.length + 1, sender: "me", text: newMessage.trim() }
    ]);

    setNewMessage("");
  };

  const handleFileUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type;

    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "me",
        fileUrl,
        fileType,
        fileName: file.name,
      },
    ]);
  };

  return (
    <div className='px-[7%] max-[900px]:px-3 text-white'>
      <div className='px-4 flex items-center justify-between max-[500px]:flex-col gap-2'>
        <TitleCard title='Chat' className='text-left' />
        <div className='relative w-[270px] max-[500px]:mx-auto'>
          <GlobalInput
            placeholder='Search friends & family...'
            height='42px'
            width='100%'
            borderRadius='100px'
          />
        </div>
      </div>

      <div className='flex h-[calc(100vh-190px)] max-[1024px]:h-[calc(100vh-160px)] max-[768px]:h-[calc(100vh-140px)] max-[500px]:h-[calc(100vh-190px)] my-3'>

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
                <div className='text-center my-4'>
                  <span className='bg-gray-700 text-xs px-12 py-1 rounded-full'>Today</span>
                </div>

                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs sm:max-w-md`}>
                      {msg.text && <p className={`rounded-lg p-2 max-w-xs sm:max-w-md ${msg.sender === "me" ? "bg-[#2A2D3A] text-white" : "bg-[#F7F7F7] text-black"}`}>{msg.text}</p>}

                      {msg.fileUrl && (
                        <>
                          {msg.fileType?.startsWith("image/") ? (
                            <Image
                              src={msg.fileUrl}
                              alt={msg.fileName || "Uploaded file"}
                              width={200}
                              height={200}
                              className="rounded-lg mt-2"
                            />
                          ) : (
                            <a
                              href={msg.fileUrl}
                              download={msg.fileName}
                              className="text-blue-400 underline mt-2 block"
                            >
                              📎 {msg.fileName}
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className='p-4 bg-[#F7F7F7] flex items-center gap-4'>
                <div className='bg-white p-2 rounded-full relative'>
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <label htmlFor="fileUpload">
                    <PlusCircle size={24} className='text-black cursor-pointer' />
                  </label>
                </div>

                <div className='flex-1 relative'>
                  <GlobalInput
                    placeholder='Write your message...'
                    height='40px'
                    width='100%'
                    borderRadius='100px'
                    bgColor='white'
                    inputClassName="pl-4 pr-12 border-none"
                    value={newMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSend()}
                  />
                </div>
                <button
                  className='bg-white p-3 rounded-full'
                  onClick={handleSend}
                >
                  <Send size={18} className='text-black' />
                </button>
              </div>
            </>
          ) : (
            <div className="max-[900px]:hidden flex flex-col items-center justify-center h-full text-gray-400">
              <Image src={ZoomerlyLogo} alt='' />
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
