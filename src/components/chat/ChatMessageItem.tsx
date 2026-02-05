import { cn } from '@/lib/utils';
import type { ChatMessage, ChatMessageMedia } from '@/hooks/use-realtime-chat';
import Image from 'next/image';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { getMediaPublicUrl } from '@/lib/supabase/chat';
import { Download, FileText } from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
}

export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  return (
    <div className={`flex mt-2 gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <div className="flex-shrink-0">
          <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <Image
              src={message.user?.avatar || ProfileAvatar}
              alt={message.user?.name || 'User'}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = ProfileAvatar.src || ProfileAvatar;
              }}
            />
          </div>
        </div>
      )}
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', { 'items-end': isOwnMessage, 'items-start': !isOwnMessage })}
      >
        {showHeader && !isOwnMessage && (
          <div className="flex items-center gap-2 text-xs px-3">
            <span className="text-foreground/70 font-medium">
              {message.user?.name || 'Unknown User'}
            </span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}

        {/* Text content with background bubble */}
        {message.content && (
          <div
            className={cn(
              'rounded-xl text-sm py-2 px-3 w-fit max-w-full',
              isOwnMessage ? 'bg-[#2A2D3A] text-white' : 'bg-[#F7F7F7] text-black'
            )}
          >
            <p className="break-words">{message.content}</p>
          </div>
        )}

        {/* Display media from media array (new RPC flow) - WhatsApp-style grid layout */}
        {message.media && message.media.length > 0 && (
          <div className={cn(message.content ? 'mt-2' : '')}>
            {(() => {
              // Group images and videos together for grid layout
              const visualMedia = message.media.filter(m => m.mediaType === 'image' || m.mediaType === 'video');
              const otherMedia = message.media.filter(m => m.mediaType !== 'image' && m.mediaType !== 'video');
              
              return (
                <>
                  {/* Images and videos in grid layout (WhatsApp style) */}
                  {visualMedia.length > 0 && (
                    <div className={cn(
                      'grid gap-1',
                      visualMedia.length === 1 ? 'grid-cols-1' :
                      visualMedia.length === 2 ? 'grid-cols-2' :
                      visualMedia.length === 3 ? 'grid-cols-2' :
                      visualMedia.length === 4 ? 'grid-cols-2' :
                      'grid-cols-3',
                      'max-w-md'
                    )}>
                      {visualMedia.map((mediaItem: ChatMessageMedia, index: number) => {
                        // For 3 items: first 2 in top row, 3rd spans full width below
                        const isThirdItem = visualMedia.length === 3 && index === 2;
                        
                        return (
                          <div
                            key={mediaItem.id}
                            className={cn(
                              'relative group cursor-pointer hover:opacity-90 transition-opacity',
                              isThirdItem ? 'col-span-2' : ''
                            )}
                            onClick={() => window.open(mediaItem.url, '_blank')}
                          >
                            {mediaItem.mediaType === 'image' ? (
                              <Image
                                src={mediaItem.url}
                                alt={mediaItem.filename || 'Image'}
                                width={400}
                                height={400}
                                className={cn(
                                  'rounded-lg object-cover w-full h-full border-0',
                                  visualMedia.length === 1 ? 'max-h-96' :
                                  visualMedia.length === 2 ? 'aspect-square' :
                                  visualMedia.length === 3 ? (isThirdItem ? 'aspect-[2/1]' : 'aspect-square') :
                                  'aspect-square'
                                )}
                                unoptimized
                              />
                            ) : (
                              <div className="relative w-full h-full">
                                <video
                                  src={mediaItem.url}
                                  controls
                                  className={cn(
                                    'rounded-lg w-full h-full object-cover border-0 outline-none',
                                    visualMedia.length === 1 ? 'max-h-96' :
                                    visualMedia.length === 2 ? 'aspect-square' :
                                    visualMedia.length === 3 ? (isThirdItem ? 'aspect-[2/1]' : 'aspect-square') :
                                    'aspect-square'
                                  )}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xl">▶</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {visualMedia.length > 1 && (
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Other media types (audio, documents) - displayed separately */}
                  {otherMedia.length > 0 && (
                    <div className={cn('flex flex-col gap-2', visualMedia.length > 0 ? 'mt-2' : '')}>
                      {otherMedia.map((mediaItem: ChatMessageMedia) => (
                        <div key={mediaItem.id} className="relative">
                          {mediaItem.mediaType === 'audio' ? (
                            <div className={`${isOwnMessage ? 'bg-[#2A2D3A]' : 'bg-[#F7F7F7]'} rounded-lg p-3`}>
                              <audio
                                src={mediaItem.url}
                                controls
                                className="w-full"
                              />
                            </div>
                          ) : (
                            <div className={`${isOwnMessage ? 'bg-[#3A3D4A]' : 'bg-[#E8E8E8]'} rounded-lg p-3 max-w-sm`}>
                              <div className="flex items-center gap-3">
                                <div className={`${mediaItem.mimeType?.includes('pdf') ? 'bg-red-500' : 'bg-blue-500'} w-12 h-12 rounded flex items-center justify-center flex-shrink-0`}>
                                  {mediaItem.mimeType?.includes('pdf') ? (
                                    <span className="text-white font-bold text-xs">PDF</span>
                                  ) : (
                                    <FileText className="text-white w-6 h-6" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`${isOwnMessage ? 'text-white' : 'text-black'} font-medium text-sm truncate`}>
                                    {mediaItem.filename || 'Document'}
                                  </p>
                                  <div className={`${isOwnMessage ? 'text-gray-300' : 'text-gray-600'} text-xs mt-1`}>
                                    {mediaItem.sizeBytes && (
                                      <span>
                                        {mediaItem.sizeBytes < 1024 
                                          ? `${mediaItem.sizeBytes} B`
                                          : mediaItem.sizeBytes < 1024 * 1024
                                          ? `${(mediaItem.sizeBytes / 1024).toFixed(1)} kB`
                                          : `${(mediaItem.sizeBytes / (1024 * 1024)).toFixed(1)} MB`}
                                      </span>
                                    )}
                                    {mediaItem.sizeBytes && mediaItem.mimeType && ' • '}
                                    {mediaItem.mimeType && (
                                      <span className="uppercase">
                                        {mediaItem.mimeType.split('/')[1] || 'FILE'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <a
                                  href={mediaItem.url}
                                  download={mediaItem.filename}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${isOwnMessage ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'} p-2 rounded-full hover:bg-opacity-20 ${isOwnMessage ? 'hover:bg-white' : 'hover:bg-black'} transition-colors`}
                                >
                                  <Download size={20} />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Fallback to legacy fileUrl for backward compatibility */}
        {!message.media && message.fileUrl && (
          <div className={message.content ? "mt-2" : ""}>
            {message.messageType === 'image' ? (
              <div className="relative group">
                <Image
                  src={message.fileUrl}
                  alt={message.fileName || 'Image'}
                  width={400}
                  height={400}
                  className="rounded-lg object-contain max-w-full max-h-96 cursor-pointer hover:opacity-90 transition-opacity border-0"
                  unoptimized
                  onClick={() => window.open(message.fileUrl, '_blank')}
                />
              </div>
            ) : message.messageType === 'video' ? (
              <div>
                <video
                  src={message.fileUrl}
                  controls
                  className="rounded-lg max-w-xs max-h-64 border-0 outline-none"
                />
              </div>
            ) : message.messageType === 'audio' ? (
              <div className={`${isOwnMessage ? 'bg-[#2A2D3A]' : 'bg-[#F7F7F7]'} rounded-lg p-3`}>
                <audio
                  src={message.fileUrl}
                  controls
                  className="w-full"
                />
              </div>
            ) : (
              <div className={`${isOwnMessage ? 'bg-[#3A3D4A]' : 'bg-[#E8E8E8]'} rounded-lg p-3 max-w-sm`}>
                <div className="flex items-center gap-3">
                  <div className={`${message.fileType?.includes('pdf') || message.fileName?.toLowerCase().endsWith('.pdf') ? 'bg-red-500' : 'bg-blue-500'} w-12 h-12 rounded flex items-center justify-center flex-shrink-0`}>
                    {message.fileType?.includes('pdf') || message.fileName?.toLowerCase().endsWith('.pdf') ? (
                      <span className="text-white font-bold text-xs">PDF</span>
                    ) : (
                      <FileText className="text-white w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${isOwnMessage ? 'text-white' : 'text-black'} font-medium text-sm truncate`}>
                      {message.fileName || 'Document'}
                    </p>
                    <div className={`${isOwnMessage ? 'text-gray-300' : 'text-gray-600'} text-xs mt-1`}>
                      {message.fileSize && (
                        <span>
                          {message.fileSize < 1024 
                            ? `${message.fileSize} B`
                            : message.fileSize < 1024 * 1024
                            ? `${(message.fileSize / 1024).toFixed(1)} kB`
                            : `${(message.fileSize / (1024 * 1024)).toFixed(1)} MB`}
                        </span>
                      )}
                      {message.fileSize && message.fileType && ' • '}
                      {message.fileType && (
                        <span className="uppercase">
                          {message.fileType.split('/')[1] || 'FILE'}
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={message.fileUrl}
                    download={message.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${isOwnMessage ? 'text-white hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'} p-2 rounded-full hover:bg-opacity-20 ${isOwnMessage ? 'hover:bg-white' : 'hover:bg-black'} transition-colors`}
                  >
                    <Download size={20} />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        {showHeader && isOwnMessage && (
          <div className="flex items-center gap-2 text-xs px-3 justify-end flex-row-reverse">
            <span className="text-foreground/50 text-xs text-left">
              {new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

