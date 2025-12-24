'use client';

import React, { useEffect } from 'react';
import { Camera, Calendar, Image as ImageIcon, UserPlus, Star, Award, Gem, X, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateOrShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateOrShareModal: React.FC<CreateOrShareModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const actionCards = [
    {
      icon: Layers,
      label: 'Active Boards',
      onClick: () => {
        router.push('/dashboard/allBoards/active');
        onClose();
      },
    },
    {
      icon: Calendar,
      label: 'Create a Board',
      onClick: () => {
        router.push('/compaign');
        onClose();
      },
    },
    {
      icon: ImageIcon,
      label: 'Share a Memory',
      onClick: () => {
        router.push('/dashboard/connections');
        onClose();
      },
    },
    {
      icon: UserPlus,
      label: 'Invite Contacts',
      onClick: () => {
        console.log('Invite Contacts clicked');
        onClose();
      },
    },
  ];

  const membershipTiers = [
    {
      icon: Star,
      label: 'Pro',
      color: 'bg-orange-500',
    },
    {
      icon: Award,
      label: 'Ambassador',
      color: 'bg-blue-500',
    },
    {
      icon: Gem,
      label: 'Axium',
      color: 'bg-green-500',
    },
  ];

  const content = (
    <>
      <div className='flex justify-between items-start mb-6'>
        <div>
          <h2 className="text-2xl font-bold text-black mb-2">Create or Share</h2>
          <p className="text-sm text-gray-600">Celebrate, share, or bring people together.</p>
        </div>

        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full border border-black flex items-center justify-center hover:bg-gray-200 transition-colors z-10 flex-shrink-0"
        >
          <X size={18} className="text-black" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {actionCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <button
              key={index}
              onClick={card.onClick}
              className="bg-[#1b1d26] rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-gray-800 active:bg-gray-800 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <IconComponent size={20} className="text-white" />
              </div>
              <span className="text-white text-sm font-medium text-center">{card.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-[#1b1d26] rounded-lg p-4">
        <h3 className="text-white font-bold text-lg mb-1">Xaioz</h3>
        <p className="text-white/80 text-sm mb-4">Build a business or community</p>

        <div className="flex gap-2">
          {membershipTiers.map((tier, index) => {
            const IconComponent = tier.icon;
            return (
              <div
                key={index}
                className={`${tier.color} rounded-lg px-3 py-2 flex items-center gap-2 flex-1 justify-center`}
              >
                <IconComponent size={16} className="text-white" />
                <span className="text-white text-xs font-medium">{tier.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      <div
        className={`max-[769px]:block hidden fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-6 max-h-[85vh] overflow-y-auto">
          {content}
        </div>
      </div>

      <div
        className={`min-[770px]:flex hidden fixed inset-0 z-[1001] items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-[90%] max-w-md transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateOrShareModal;

