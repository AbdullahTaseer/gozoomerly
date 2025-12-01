import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/hooks/use-realtime-chat';
import Image from 'next/image';

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
}

export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  return (
    <div className={`flex mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
          'items-end': isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn('flex items-center gap-2 text-xs px-3', {
              'justify-end flex-row-reverse': isOwnMessage,
            })}
          >
            {!isOwnMessage && (
              <Image
                src={message.user.avatar || '/default-avatar.png'}
                alt={message.user.name}
                width={16}
                height={16}
                className="rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
            )}
            <span className={'font-medium'}>{message.user.name}</span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}

        <div
          className={cn(
            'py-2 px-3 rounded-xl text-sm w-fit',
            isOwnMessage ? 'bg-[#2A2D3A] text-white' : 'bg-[#F7F7F7] text-black'
          )}
        >
          {message.content && <p>{message.content}</p>}
          
          {message.fileUrl && (
            <div className={message.content ? "mt-2" : ""}>
              {message.messageType === 'image' ? (
                <Image
                  src={message.fileUrl}
                  alt={message.fileName || 'Image'}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              ) : message.messageType === 'video' ? (
                <video
                  src={message.fileUrl}
                  controls
                  className="rounded-lg max-w-xs"
                />
              ) : (
                <a
                  href={message.fileUrl}
                  download={message.fileName}
                  className={`${isOwnMessage ? 'text-blue-300' : 'text-blue-600'} underline flex items-center gap-1`}
                >
                  📎 {message.fileName || 'File'}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

