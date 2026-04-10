'use client';

import { MessageCircleMore, Layers, Share2, X, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateOrShareModalContentProps {
  onClose: () => void;
  /** When set, "Post status" opens Add Status instead of navigating away. */
  onPostStatus?: () => void;
}

const CreateOrShareModalContent: React.FC<CreateOrShareModalContentProps> = ({ onClose, onPostStatus }) => {
  const router = useRouter();

  const actions = [
    {
      icon: MessageCircleMore,
      label: 'New Chat',
      onClick: () => {
        router.push('/u/chat');
        onClose();
      },
    },
    {
      icon: Calendar,
      label: 'Post status',
      onClick: () => {
        onClose();
        if (onPostStatus) {
          onPostStatus();
        } else {
          router.push('/u/connections');
        }
      },
    },
    {
      icon: Layers,
      label: 'New board',
      onClick: () => {
        router.push('/compaign');
        onClose();
      },
    },
    {
      icon: Share2,
      label: 'Share memories',
      onClick: () => {
        router.push('/u/connections');
        onClose();
      },
    },
  ];

  const content = (
    <>
      <div className="px-3 flex items-center gap-4 justify-between">
        <h3 className="text-black text-[20px] 3sm:text-[18px] 2xs:text-[14px] font-[700] tracking-normal">
          Create or Share
        </h3>
        <button
          onClick={onClose}
          className="hover:bg-gray-100 border border-black w-[28px] h-[28px] rounded-full flex items-center justify-center cursor-pointer shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3 mt-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full flex items-center cursor-pointer gap-3 px-4 py-3.5 rounded-lg bg-[#1b1d26] hover:bg-[#252730] active:bg-[#252730] transition-colors"
            >
              <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <IconComponent size={20} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-white font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );

  return <>{content}</>;
};

export default CreateOrShareModalContent;

