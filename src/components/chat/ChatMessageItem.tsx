import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/hooks/use-realtime-chat';
import Image from 'next/image';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";

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
                src={message.user.avatar || ProfileAvatar}
                alt={message.user.name}
                width={16}
                height={16}
                className="rounded-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = ProfileAvatar.src || ProfileAvatar;
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
            'py-2 px-3 rounded-xl text-sm w-fit max-w-full',
            isOwnMessage ? 'bg-[#2A2D3A] text-white' : 'bg-[#F7F7F7] text-black'
          )}
        >
          {message.content && <p className="break-words">{message.content}</p>}
          
          {message.fileUrl && (
            <div className={message.content ? "mt-2" : ""}>
              {message.messageType === 'image' ? (
                <div className="relative group">
                  <div className="relative max-w-sm">
                    <Image
                      src={message.fileUrl}
                      alt={message.fileName || 'Image'}
                      width={400}
                      height={400}
                      className="rounded-lg object-contain max-w-full max-h-96 cursor-pointer hover:opacity-90 transition-opacity"
                      unoptimized
                      onClick={() => window.open(message.fileUrl, '_blank')}
                    />
                  </div>
                  {message.fileName && (
                    <p className="text-xs mt-1 opacity-70 truncate max-w-sm">{message.fileName}</p>
                  )}
                </div>
              ) : message.messageType === 'video' ? (
                <div className="space-y-1">
                  <video
                    src={message.fileUrl}
                    controls
                    className="rounded-lg max-w-xs max-h-64"
                  />
                  {message.fileName && (
                    <p className="text-xs opacity-70 truncate">{message.fileName}</p>
                  )}
                </div>
              ) : message.messageType === 'audio' ? (
                <div className="space-y-1">
                  <audio
                    src={message.fileUrl}
                    controls
                    className="w-full"
                  />
                  {message.fileName && (
                    <p className="text-xs opacity-70 truncate">{message.fileName}</p>
                  )}
                </div>
              ) : (
                <a
                  href={message.fileUrl}
                  download={message.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isOwnMessage ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'} underline flex items-center gap-2 p-2 rounded hover:bg-opacity-10 ${isOwnMessage ? 'hover:bg-white' : 'hover:bg-black'}`}
                >
                  <span className="text-lg">📎</span>
                  <span className="break-words">{message.fileName || 'File'}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

