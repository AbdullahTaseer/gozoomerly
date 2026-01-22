'use client';

import { useRouter } from 'next/navigation';

interface BoardCategoryCardProps {
  count: number;
  label: string;
  path: string;
  gradient?: string[];
}

const BoardCategoryCard: React.FC<BoardCategoryCardProps> = ({
  count,
  label,
  path,
  gradient = ['#845CBA', '#F43C83']
}) => {
  const router = useRouter();

  const gradientStyle = {
    background: `linear-gradient(90deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
  };

  return (
    <div
      onClick={() => router.push(path)}
      className="relative rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
      style={gradientStyle}
    >
      <div className="flex justify-center mb-4 mt-2">
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <span className="text-white text-3xl font-bold">{count.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white text-lg font-semibold">{label}</p>
      </div>
    </div>
  );
};

export default BoardCategoryCard;

