'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, ArrowLeft, Upload, Image as ImageIcon, Play, Music, Type, Mic, Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/supabase/auth';
import { uploadBoardMedia } from '@/lib/supabase/boards';

interface WishModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  honoreeName?: string;
  onSubmit?: (data: WishData) => void;
}

interface MediaItem {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  uploadedId?: string;
}

interface MusicOption {
  id: string;
  title: string;
  description: string;
  url?: string;
}

interface WishData {
  media: MediaItem[];
  text: string;
  music: MusicOption | null;
}

const musicOptions: MusicOption[] = [
  { id: 'none', title: 'No Music', description: 'Keep it quiet and peaceful', url: '' },
  { id: 'happy-birthday', title: 'Happy Birthday', description: 'Classic celebration tune', url: 'https://example.com/happy-birthday.mp3' },
  { id: 'upbeat-1', title: 'Upbeat Celebration', description: 'Energetic and fun vibes', url: 'https://example.com/upbeat.mp3' },
  { id: 'soft-ambient', title: 'Soft Ambient', description: 'Gentle background melody', url: 'https://example.com/soft.mp3' },
  { id: 'upbeat-2', title: 'Upbeat Celebration', description: 'Energetic and fun vibes', url: 'https://example.com/upbeat2.mp3' },
  { id: 'soft-ambient-2', title: 'Soft Ambient', description: 'Gentle background melody', url: 'https://example.com/soft2.mp3' },
  { id: 'happy-birthday-2', title: 'Happy Birthday', description: 'Classic celebration tune', url: 'https://example.com/happy2.mp3' },
  { id: 'upbeat-3', title: 'Upbeat Celebration', description: 'Classic celebration tune', url: 'https://example.com/upbeat3.mp3' },
];

const WishModal: React.FC<WishModalProps> = ({
  isOpen,
  onClose,
  boardId,
  honoreeName = 'Sean',
  onSubmit
}) => {
  const [step, setStep] = useState(1);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [text, setText] = useState('');
  const [selectedMusic, setSelectedMusic] = useState<MusicOption | null>(null);
  const [musicSearch, setMusicSearch] = useState('');
  const [showTextOverlay, setShowTextOverlay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;

  useEffect(() => {
    return () => {
      media.forEach(item => {
        if (item.preview && item.preview.startsWith('blob:')) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [media]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: MediaItem[] = [];
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const preview = URL.createObjectURL(file);
      newMedia.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        type: isVideo ? 'video' : 'image'
      });
    });

    setMedia(prev => [...prev, ...newMedia]);
    if (media.length === 0 && newMedia.length > 0) {
      setStep(2);
    }
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
    if (selectedMediaIndex >= media.length - 1) {
      setSelectedMediaIndex(Math.max(0, media.length - 2));
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const uploadMedia = async (): Promise<{ mediaIds: string[]; errors: string[] }> => {
    const user = await authService.getUser();
    if (!user) throw new Error('User not authenticated');

    const mediaIds: string[] = [];
    const errors: string[] = [];

    for (const item of media) {
      try {
        const mediaType = item.type === 'image' ? 'image' as const
          : item.type === 'video' ? 'video' as const
          : 'audio' as const;

        const { data, error } = await uploadBoardMedia(
          boardId,
          user.id,
          item.file,
          mediaType
        );

        if (error) {
          const errorMsg = error.message || 'Unknown upload error';

          if (errorMsg.includes('Bucket not found') || errorMsg.includes('does not exist')) {
            errors.push(
              `Failed to upload ${item.file.name}: Storage bucket not found. ` +
              `Please create a 'profile-images' bucket in Supabase Dashboard → Storage → Create Bucket (make it public).`
            );
          } else if (errorMsg.includes('403') || errorMsg.includes('Permission')) {
            errors.push(
              `Failed to upload ${item.file.name}: Permission denied. ` +
              `Please check storage bucket policies allow authenticated uploads.`
            );
          } else {
            errors.push(`Failed to upload ${item.file.name}: ${errorMsg}`);
          }
        continue;
      }

        if (data?.id) {
          mediaIds.push(data.id);
        } else {
          errors.push(`Failed to get media ID for ${item.file.name}`);
        }
      } catch (err: any) {
        errors.push(`Error uploading ${item.file.name}: ${err.message || 'Unknown error'}`);
      }
    }

    return { mediaIds, errors };
  };

  const handleSubmitWish = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const supabase = createClient();
      const user = await authService.getUser();

      if (!user) {
        setError('Please log in to submit a wish');
        return;
      }

      let mediaIds: string[] = [];
      let uploadErrors: string[] = [];

      if (media.length > 0) {
        const uploadResult = await uploadMedia();
        mediaIds = uploadResult.mediaIds;
        uploadErrors = uploadResult.errors;

        if (uploadErrors.length > 0 && mediaIds.length === 0) {

          setError(`Failed to upload media: ${uploadErrors.join(', ')}. Please try again or submit without media.`);
          return;
        } else if (uploadErrors.length > 0) {
        }
      }

      const mediaIdsArray = mediaIds;

      const rpcParams = {
        p_sender_id: user.id,
        p_board_id: boardId,
        p_content: text || `Happy Birthday, ${honoreeName}!`,
        p_media_ids: mediaIdsArray,
        p_audio_url: selectedMusic?.id !== 'none' ? selectedMusic?.url : null,
        p_max_media_count: 10,
        p_max_content_length: 1000,
      };

      let wishData;
      let rpcError;

      const { data: rpcData, error: rpcErr } = await supabase.rpc('create_wish', rpcParams);

      if (rpcErr) {
        rpcError = rpcErr;

        const { data: directData, error: directError } = await supabase
          .from('wishes')
          .insert({
            sender_id: user.id,
            board_id: boardId,
            content: text || `Happy Birthday, ${honoreeName}!`,
            media_ids: mediaIdsArray,
          })
          .select()
          .single();

        if (directError) {
          setError(directError.message || 'Failed to create wish');
        return;
      }

        wishData = directData;

        const { error: countError } = await supabase.rpc('increment_board_wishes_count', { p_board_id: boardId });
        if (countError) {

          const { data: boardData } = await supabase
            .from('boards')
            .select('wishes_count')
            .eq('id', boardId)
            .single();

          if (boardData) {
            await supabase
              .from('boards')
              .update({ wishes_count: (boardData.wishes_count || 0) + 1 })
              .eq('id', boardId);
          }
        }
      } else {
        wishData = rpcData;
      }

      onSubmit?.({
        media,
        text,
        music: selectedMusic
      });

      media.forEach(item => {
        if (item.preview && item.preview.startsWith('blob:')) {
          URL.revokeObjectURL(item.preview);
        }
      });

      setMedia([]);
      setText('');
      setSelectedMusic(null);
      setSelectedMediaIndex(0);
      setStep(1);

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit wish');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmitWish();
    }
  };

  const filteredMusic = musicOptions.filter(m =>
    m.title.toLowerCase().includes(musicSearch.toLowerCase()) ||
    m.description.toLowerCase().includes(musicSearch.toLowerCase())
  );

  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {}
      <div className="relative bg-white rounded-[24px] w-[450px] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden">
        {}
        <div className="p-4 flex items-center gap-4">
          <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #E91E63 0%, #9C27B0 100%)'
              }}
            />
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        {}
        {error && (
          <div className="mx-4 mb-2 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {}
        {step === 1 && (
          <div className="flex-1 flex flex-col p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black flex items-center justify-center gap-2">
                Add your wish <span>💝</span>
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Make it personal your photos, videos, and voice will be part of their forever memory Photos
              </p>
            </div>

            {}
            <div className="relative flex-1 flex items-center justify-center">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-8 w-2 h-2 bg-pink-400 rounded-full" />
                <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                <div className="absolute bottom-20 left-16 w-2 h-2 bg-purple-400 rounded-full" />
                <div className="absolute bottom-12 right-8 w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <div className="absolute top-1/3 left-4 w-1 h-1 bg-green-400 rounded-full" />
                <div className="absolute top-1/2 right-6 w-2 h-2 bg-orange-400 rounded-full" />
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <ImageIcon size={28} className="text-gray-400" />
                  </div>
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center -ml-4">
                    <Play size={28} className="text-gray-400" />
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Drag photos and videos here</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 rounded-full text-white font-semibold text-base flex items-center justify-center gap-2 mt-6"
              style={{
                background: 'linear-gradient(90deg, #E91E63 0%, #9C27B0 100%)'
              }}
            >
              <Upload size={20} />
              Upload Media
            </button>
          </div>
        )}

        {}
        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="text-center py-2">
              <h2 className="text-xl font-bold text-black">Add Media</h2>
            </div>

            {}
            <div className="relative flex-1 bg-black min-h-[300px]">
              {media.length > 0 && (
                <>
                  {media[selectedMediaIndex]?.type === 'video' ? (
                    <video
                      src={media[selectedMediaIndex].preview}
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <Image
                      src={media[selectedMediaIndex]?.preview || ''}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  )}

                  {}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                    <button
                      onClick={() => setShowTextOverlay(!showTextOverlay)}
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                    >
                      <Type size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                    >
                      <Music size={20} className="text-gray-700" />
                    </button>
                    <button
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                    >
                      <Mic size={20} className="text-gray-700" />
                    </button>
                  </div>

                  {}
                  <button
                    onClick={() => handleRemoveMedia(media[selectedMediaIndex].id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </>
              )}

              {}
              {showTextOverlay && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
                  <div className="w-full max-w-sm">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Add your message..."
                      className="w-full h-32 bg-white rounded-xl p-4 text-black resize-none outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => setShowTextOverlay(false)}
                      className="w-full mt-3 py-3 bg-white rounded-full font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {}
            <div className="p-4 bg-gray-900">
              <div className="flex gap-2 overflow-x-auto">
                {media.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMediaIndex(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      selectedMediaIndex === index ? 'border-pink-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={item.preview}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center flex-shrink-0 hover:border-gray-500"
                >
                  <Plus size={24} className="text-gray-500" />
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="p-4">
              <button
                onClick={handleContinue}
                disabled={media.length === 0}
                className="w-full py-4 rounded-full text-white font-semibold text-base disabled:opacity-50"
                style={{
                  background: 'linear-gradient(90deg, #E91E63 0%, #9C27B0 100%)'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {}
        {step === 3 && (
          <div className="flex-1 flex flex-col h-[600px] max-h-[80vh]">
            <div className="text-center py-4">
              <h2 className="text-xl font-bold text-black">Add Music</h2>
            </div>

            {}
            <div className="px-4 pb-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Background Music"
                  value={musicSearch}
                  onChange={(e) => setMusicSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-full text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            {}
            <div className="flex-1 overflow-y-auto px-4 min-h-0">
              <div className="space-y-2">
                {filteredMusic.map((music) => (
                  <div
                    key={music.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedMusic(music)}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Music size={20} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-black">{music.title}</p>
                      <p className="text-sm text-gray-500">{music.description}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200">
                      <Play size={18} className="text-gray-600 ml-0.5" />
                    </button>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedMusic?.id === music.id
                          ? 'border-black bg-black'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedMusic?.id === music.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4">
              <button
                onClick={handleContinue}
                className="w-full py-4 rounded-full text-white font-semibold text-base"
                style={{
                  background: 'linear-gradient(90deg, #E91E63 0%, #9C27B0 100%)'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {}
        {step === 4 && (
          <div className="flex-1 flex flex-col p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black flex items-center justify-center gap-2">
                Write your message <span>✍️</span>
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Share your heartfelt wishes for {honoreeName}
              </p>
            </div>

            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Write your birthday wish for ${honoreeName}...`}
                className="w-full h-full min-h-[200px] bg-gray-50 rounded-2xl p-4 text-black resize-none outline-none border border-gray-200 focus:border-gray-400"
                maxLength={1000}
              />
              <p className="text-right text-gray-400 text-sm mt-2">
                {text.length}/1000
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmitWish}
                disabled={isSubmitting}
                className="w-full py-4 rounded-full text-white font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-70"
                style={{
                  background: 'linear-gradient(90deg, #E91E63 0%, #9C27B0 100%)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Wish'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishModal;
