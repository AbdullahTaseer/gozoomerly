import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

import GlobalButton from '../buttons/GlobalButton';
import ShareModalTrigger from '@/components/modals/ShareModalTrigger';

import Avatar from "@/assets/svgs/Sam.svg";
import FarahImg from "@/assets/svgs/Farah.svg";
import BoardBgImg from "@/assets/pngs/live-board-bg.png";
import LiveBoardBoys from "@/assets/pngs/live-board-boys.png";

type MediaItem = {
  id: string;
  url: string;
  type: 'image' | 'video';
};

type BoardData = {
  title?: string;
  firstName?: string;
  lastName?: string;
  hometown?: string;
  dateOfBirth?: string;
  description?: string;
  goalAmount?: number;
  profilePhotoUrl?: string;
  themeColor?: string;
};

type CreatorData = {
  name?: string;
  profilePicUrl?: string;
};

type Props = {
  onPublish?: () => void;
  isPublishing?: boolean;
  /** After a successful publish — same screen, share flow as `/u/boards/[id]`. */
  isPublished?: boolean;
  shareUrl?: string;
  /** Called when the user follows the dashboard link (e.g. clear wizard state after publish). */
  onDashboardNavigate?: () => void;
  boardData?: BoardData;
  creatorData?: CreatorData;
  uploadedMedia?: MediaItem[];
};

const YourBoardIsLive = ({
  onPublish,
  isPublishing,
  isPublished,
  shareUrl,
  onDashboardNavigate,
  boardData,
  creatorData,
  uploadedMedia,
}: Props) => {
  const fullName = boardData?.firstName && boardData?.lastName
    ? `${boardData.firstName} ${boardData.lastName}`
    : boardData?.firstName || boardData?.lastName || 'Birthday Star';

  const boardTitle = boardData?.title || `${fullName} birthday`;
  const hometown = boardData?.hometown || '';
  const dateOfBirth = boardData?.dateOfBirth
    ? new Date(boardData.dateOfBirth).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
    : '';
  const description = boardData?.description || `Happy Birthday, ${boardData?.firstName || fullName}! 🎉 Wishing you a fantastic year ahead filled with health, happiness, and success. May your special day be as amazing as you are.`;
  const goalAmount = boardData?.goalAmount || 0;
  const profilePhoto = boardData?.profilePhotoUrl || Avatar;

  const creatorName = creatorData?.name || 'You';
  const creatorAvatar = creatorData?.profilePicUrl || FarahImg;

  const firstMedia = uploadedMedia && uploadedMedia.length > 0 ? uploadedMedia[0] : null;

  const showShare = Boolean(isPublished && shareUrl);

  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 max-[420px]:p-4 mx-auto space-y-6">
      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          {showShare ? 'Your board is live! 🥳' : 'Your board is ready! 🥳'}
        </p>
        <p className="text-sm text-center mt-1 text-gray-600">
          {showShare
            ? 'Share your board link so friends and family can send wishes, gifts, and memories.'
            : 'Your board is created and saved as a draft. Click "Publish Board" to make it live and start inviting people!'}
        </p>
      </div>

      <div className='relative min-h-[500px] p-4 max-[420px]:p-3'>
        <Image src={BoardBgImg} alt='' className='rounded-lg inset-0 h-full object-cover absolute' />
        <p className='text-[42px] max-[768px]:text-[28px] relative text-white'>{boardTitle}</p>
        <div className='relative z-10 flex items-center gap-3 mt-4'>
          {typeof profilePhoto === 'string' ? (
            <img src={profilePhoto} alt={fullName} height={50} width={50} className='rounded-full border-3 border-pink-100 h-[50px] w-[50px] object-cover' />
          ) : (
            <Image src={profilePhoto} alt={fullName} height={50} width={50} className='rounded-full border-3 border-pink-100' />
          )}
          <div className='text-white'>
            <p className='text-md'>{fullName}</p>
            <p className='text-sm'>
              {hometown && <><span className='font-bold'>Hometown:</span> {hometown}</>}
              {hometown && dateOfBirth && ' • '}
              {dateOfBirth && <><span className='font-bold'>Birthdate:</span> {dateOfBirth}</>}
            </p>
          </div>
        </div>
        <div className='relative'>
          <p className='text-white pt-4 text-[16px] max-[450px]:text-[14px]'>
            {description}
            {goalAmount > 0 && ` and the goal is $${goalAmount.toLocaleString()}`}
          </p>
          <div className='flex gap-3 mt-4 items-center'>
            <p className='bg-white text-sm rounded-full px-4 py-1 cursor-pointer'>Post Media</p>
            <p className='bg-white text-sm rounded-full px-4 py-1 cursor-pointer'>Wish</p>
          </div>
        </div>

        <div className='relative z-10 rounded-b-lg overflow-clip mt-6'>
          <div className='bg-white/50 p-4 max-[420px]:p-3'>
            <div className='flex justify-between text-xs text-center flex-wrap gap-2 items-center'>
              <div>
                <p>0</p>
                <p>Participants</p>
              </div>
              <div>
                <p>0</p>
                <p>Wishes</p>
              </div>
              <div>
                <p>0</p>
                <p>Gifts</p>
              </div>
            </div>
            <div className='p-4 border border-[#B2B2B2] bg-[#DDCFDB] rounded-lg mt-4'>
              <div className='flex gap-2 items-center flex-wrap text-sm'>
                {typeof creatorAvatar === 'string' ? (
                  <img src={creatorAvatar} alt={creatorName} height={35} width={35} className='rounded-full h-[35px] w-[35px] object-cover' />
                ) : (
                  <Image src={creatorAvatar} alt={creatorName} height={35} width={35} className='rounded-full' />
                )}
                <span>{creatorName}</span>
                <span className='bg-white/40 rounded-full px-3 py-1 text-xs'>Creator</span>
              </div>
              {firstMedia ? (
                firstMedia.type === 'video' ? (
                  <video
                    src={firstMedia.url}
                    className='mt-4 w-full rounded-lg max-h-[300px] object-cover'
                    controls={false}
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={firstMedia.url}
                    alt='Uploaded media'
                    className='mt-4 w-full rounded-lg max-h-[300px] object-cover'
                  />
                )
              ) : (
                <Image src={LiveBoardBoys} alt='' className='mt-4 w-full rounded-lg' />
              )}
              <p className='mt-2 text-sm'>{boardData?.firstName || fullName}, you&apos;re the most deserving person I know. Here&apos;s to your special day! 🎉</p>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <Heart size={16} />
                  <span>0</span>
                </div>
                <div className='flex items-center gap-1'>
                  <MessageCircle size={16} />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className="space-y-3">
        {showShare && shareUrl ? (
          <ShareModalTrigger
            shareUrl={shareUrl}
            title={boardTitle}
            triggerStyle="primary"
            buttonTitle="Share"
            className="mt-6"
          />
        ) : (
          onPublish && (
            <GlobalButton
              title={isPublishing ? 'Publishing...' : 'Publish Board'}
              height="48px"
              className="mt-6"
              onClick={onPublish}
              disabled={isPublishing}
            />
          )
        )}

        <Link href="/u/home" onClick={() => onDashboardNavigate?.()}>
          <GlobalButton
            title={showShare ? 'Go to Dashboard' : 'Save as Draft & Go to Dashboard'}
            height="48px"
            bgColor="#E5E5E5"
            color="#333333"
            className="mt-3"
          />
        </Link>
      </div>
    </div>
  );
};

export default YourBoardIsLive;
