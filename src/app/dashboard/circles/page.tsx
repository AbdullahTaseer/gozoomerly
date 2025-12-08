'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TitleCard from '@/components/cards/TitleCard';
import CircleCard from '@/components/cards/CircleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import { authService } from '@/lib/supabase/auth';
import GlobalModal from '@/components/modals/GlobalModal';
import FloatingInput from '@/components/inputs/FloatingInput';
import AddCircleModal from '@/components/modals/AddCircleModal';
import { CircleWithDetails, getUserCircles, deleteCircle } from '@/lib/supabase/circles';

interface Circle {
  id: string;
  name: string;
  slug: string;
  circle_type?: string;
  description?: string;
  color?: string;
  icon?: string;
  is_default?: boolean;
  is_system_generated?: boolean;
  display_order?: number;
  member_count: number;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
  avatars: string[];
  memberCount: number;
}

const Circles = () => {
  const router = useRouter();
  const [circles, setCircles] = useState<CircleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createCircleModalOpen, setIsCreateCircleModalOpen] = useState(false);
  const [editCircleModalOpen, setEditCircleModalOpen] = useState(false);
  const [circleToEdit, setCircleToEdit] = useState<CircleWithDetails | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [circleToDelete, setCircleToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletingCircle, setDeletingCircle] = useState(false);

  useEffect(() => {
    fetchUserCircles();
  }, []);

  const fetchUserCircles = async () => {
    try {
      const user = await authService.getUser();

      if (!user) {
        router.push('/signin');
        return;
      }

      const { data, error: circleError } = await getUserCircles(user.id);

      if (circleError) {
        setError(`Failed to load circles: ${circleError.message}`);
        setLoading(false);
        return;
      }

      setCircles(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCircle = (circle: CircleWithDetails) => {
    setCircleToEdit(circle);
    setEditCircleModalOpen(true);
  };

  const handleDeleteCircle = (circleId: string, circleName: string) => {
    setCircleToDelete({ id: circleId, name: circleName });
    setDeleteModalOpen(true);
  };

  const confirmDeleteCircle = async () => {
    if (!circleToDelete) return;

    try {
      setDeletingCircle(true);
      const { error: deleteError } = await deleteCircle(circleToDelete.id);
      
      if (deleteError) {
        alert(`Failed to delete circle: ${deleteError.message}`);
        return;
      }

      // Successfully deleted - refresh the circles list
      await fetchUserCircles();
      
      // Close modal and reset state
      setDeleteModalOpen(false);
      setCircleToDelete(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      alert(`Error deleting circle: ${errorMessage}`);
    } finally {
      setDeletingCircle(false);
    }
  };

  return (
    <div className='px-[7%] max-[769px]:px-4 py-4'>

      <div className='flex justify-between max-[1200px]:flex-col gap-6'>
        <TitleCard title='My Circles' className='text-left' />
        <div className='flex gap-4 max-[580px]:gap-2 max-[350px]:gap-1 items-center max-[1200px]:mx-auto'>
          <div className='relative w-[300px] max-[580px]:w-[170px]'>
            <Search size={18} className='absolute top-3 left-3' />
            <GlobalInput placeholder='Search circles...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
          </div>
          <Image src={FilterSliderIcon} alt='' height={45} width={45} />
          <GlobalButton onClick={() => setIsCreateCircleModalOpen(true)} title='Create Circle' height='42px' className='w-[164px] max-[580px]:w-[120px]' />
        </div>
      </div>

      <div className='mt-4'>
        {!loading && !error && circles.length > 0 && (
          <p className='text-sm text-gray-600 mb-4'>
            Showing {circles.length} {circles.length === 1 ? 'circle' : 'circles'}
          </p>
        )}
        
        <div className='grid max-[700px]:grid-cols-1 grid-cols-2 gap-6'>
          {loading ? (
            <div className='col-span-full text-center py-8'>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p>Loading your circles...</p>
            </div>
          ) : error ? (
            <div className='col-span-full text-center py-8'>
              <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
                <p className='text-red-600 font-semibold mb-2'>Error Loading Circles</p>
                <p className='text-red-500 text-sm'>{error}</p>
                <button 
                  onClick={fetchUserCircles}
                  className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : circles.length === 0 ? (
            <div className='col-span-full text-center py-12'>
              <div className='max-w-md mx-auto'>
                <div className='text-6xl mb-4'>👥</div>
                <p className='text-xl font-semibold text-gray-700 mb-2'>No Circles Yet</p>
                <p className='text-gray-500 mb-6'>You haven't joined any circles yet. Create your first circle to get started!</p>
                <GlobalButton title='Create Your First Circle' onClick={() => console.log('Create circle')} />
              </div>
            </div>
          ) : (
            circles.map((circle) => (
              <CircleCard
                key={circle.id}
                title={circle.name}
                backgroundImage={circle.image_url || circle.color || '#667eea'}
                avatars={circle.avatars}
                memberCount={circle.memberCount}
                onClick={() => router.push(`/dashboard/circle/${circle.id}`)}
                onEdit={() => handleEditCircle(circle)}
                onDelete={() => handleDeleteCircle(circle.id, circle.name)}
              />
            ))
          )}
        </div>
      </div>

      <GlobalModal
        title='Create Circle'
        isOpen={createCircleModalOpen}
        onClose={() => setIsCreateCircleModalOpen(false)}
        className="w-[500px] max-[550px]:w-[95vw]"
      >
        <AddCircleModal
          onCircleCreated={() => {
            fetchUserCircles();
            setIsCreateCircleModalOpen(false);
          }}
        />
      </GlobalModal>

      <GlobalModal
        title='Edit Circle'
        isOpen={editCircleModalOpen}
        onClose={() => {
          setEditCircleModalOpen(false);
          setCircleToEdit(null);
        }}
        className="w-[500px] max-[550px]:w-[95vw]"
      >
        <AddCircleModal
          editMode={true}
          circleData={circleToEdit ? {
            id: circleToEdit.id,
            name: circleToEdit.name,
            image_url: circleToEdit.image_url,
            color: circleToEdit.color,
            description: circleToEdit.description,
            circle_type: circleToEdit.circle_type,
            icon: circleToEdit.icon,
            is_default: circleToEdit.is_default,
            display_order: circleToEdit.display_order,
          } : undefined}
          onCircleCreated={() => {
            fetchUserCircles();
            setEditCircleModalOpen(false);
            setCircleToEdit(null);
          }}
        />
      </GlobalModal>

      <GlobalModal
        title="Delete Circle"
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deletingCircle) {
            setDeleteModalOpen(false);
            setCircleToDelete(null);
          }
        }}
        className="w-[450px] max-[500px]:w-[95vw]"
      >
        <div className="space-y-6">
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-semibold">{circleToDelete?.name}</span>?
          </p>
          <div className="flex gap-3 justify-end">
            <GlobalButton
              title="Cancel"
              bgColor="#E5E7EB"
              width="100px"
              hover={{ bgColor: "#D1D5DB" }}
              onClick={() => {
                setDeleteModalOpen(false);
                setCircleToDelete(null);
              }}
              disabled={deletingCircle}
            />
            <GlobalButton
              title={deletingCircle ? "Deleting..." : "Delete"}
              bgColor="#EF4444"
              width="120px"
              hover={{ bgColor: "#DC2626" }}
              onClick={confirmDeleteCircle}
              disabled={deletingCircle}
            />
          </div>
        </div>
      </GlobalModal>
    </div>
  );
};

export default Circles;