'use client';
import {  useState, useRef, useEffect  } from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';

type Props = {
  title: string;
  backgroundImage: string | StaticImport;
  avatars: (string | StaticImport)[];
  memberCount: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const CircleCard = ({ title, backgroundImage, avatars, memberCount, onClick, onEdit, onDelete }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarsToShow = avatars.slice(0, 3);
  const remainingCount = Math.max(0, memberCount - avatarsToShow.length);

  const isColorValue = typeof backgroundImage === 'string' && (backgroundImage.startsWith('#') || backgroundImage.startsWith('rgb'));
  const isImageUrl = typeof backgroundImage === 'string' && (backgroundImage.startsWith('http') || backgroundImage.startsWith('/'));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div onClick={onClick} className='relative w-full h-[400px] rounded-2xl overflow-hidden group cursor-pointer shadow-xl'>
      {isImageUrl ? (
        <>
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70' />
        </>
      ) : (
        <>
          <div
            className='absolute inset-0 transition-transform duration-300 group-hover:scale-105'
            style={{
              background: isColorValue
                ? backgroundImage
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50' />
        </>
      )}

      <div className='relative z-10 flex flex-col items-center justify-center h-full px-6 py-8 text-white'>
        <h2 className='text-2xl font-bold mb-8 text-center'>{title}</h2>

        <div className='flex items-center justify-center mb-6'>
          {avatarsToShow.length > 0 ? (
            <>
              {avatarsToShow.map((avatar, index) => (
                <div
                  key={index}
                  className='rounded-full -ml-8 border-[3px] border-white bg-white shadow-lg transition-transform hover:scale-110'
                >
                  <img
                    src={avatar as string}
                    alt={`Member ${index + 1}`}
                    className='w-[70px] h-[70px] rounded-full object-cover'
                  />
                </div>
              ))}
              {remainingCount > 0 && (
                <div className='w-[70px] -ml-8 h-[70px] rounded-full border-[3px] border-white bg-white flex items-center justify-center text-gray-800 text-2xl font-bold shadow-lg transition-transform hover:scale-110'>
                  +{remainingCount}
                </div>
              )}
            </>
          ) : (
            <div className='w-[70px] h-[70px] rounded-full border-[3px] border-white bg-white/20 backdrop-blur-sm flex items-center justify-center'>
              <span className='text-3xl'>👥</span>
            </div>
          )}
        </div>
      </div>

      <div className='absolute top-4 right-4 z-20' ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className='p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg'
        >
          <MoreVertical size={20} className='text-gray-800' />
        </button>

        {}
        {menuOpen && (
          <div className='absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onEdit?.();
              }}
              className='w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2'
            >
              <Edit size={20} />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onDelete?.();
              }}
              className='w-full px-4 py-3 cursor-pointer text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2'
            >
              <Trash2 />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircleCard;