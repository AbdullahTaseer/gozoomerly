import { useCallback } from 'react';
import type { StaticImageData } from 'next/image';
import { authService } from '@/lib/supabase/auth';
import { uploadStoryMedia, createStory, isStoryVideoFile } from '@/lib/supabase/stories';
import toast from 'react-hot-toast';

export interface UseAddStatusSubmitOptions {
  onSuccess?: () => void;
}

export function useAddStatusSubmit(options?: UseAddStatusSubmitOptions) {
  const onSuccess = options?.onSuccess;

  const handleStatusImageSelect = useCallback((_imageUrl: string | StaticImageData) => {}, []);

  const handleStoryCreate = useCallback(
    async (file: File, caption: string) => {
      const user = await authService.getUser();
      if (!user?.id) {
        toast.error('Please sign in to create a story');
        return;
      }

      try {
        const { mediaId, error: uploadError } = await uploadStoryMedia(user.id, file);

        if (uploadError || !mediaId) {
          toast.error('Failed to upload story media');
          return;
        }

        const contentType = isStoryVideoFile(file) ? 'video' : 'image';

        const { data: story, error: createError } = await createStory(user.id, {
          content_type: contentType,
          media_id: mediaId,
          caption: caption || undefined,
        });

        if (createError || !story) {
          toast.error('Failed to create story');
          return;
        }

        toast.success('Story created successfully!');
        onSuccess?.();
      } catch {
        toast.error('Failed to create story');
      }
    },
    [onSuccess]
  );

  const handleMultipleStoriesCreate = useCallback(
    async (storiesData: { file: File; caption: string }[]) => {
      const user = await authService.getUser();
      if (!user?.id) {
        toast.error('Please sign in to create stories');
        return;
      }

      if (storiesData.length === 0) {
        return;
      }

      try {
        const uploadPromises = storiesData.map(async ({ file, caption }) => {
          const { mediaId, error: uploadError } = await uploadStoryMedia(user.id, file);

          if (uploadError || !mediaId) {
            throw new Error(`Failed to upload story media: ${uploadError?.message || 'Unknown error'}`);
          }

          const contentType = isStoryVideoFile(file) ? 'video' : 'image';

          const { data: story, error: createError } = await createStory(user.id, {
            content_type: contentType,
            media_id: mediaId,
            caption: caption || undefined,
          });

          if (createError || !story) {
            throw new Error(`Failed to create story: ${createError?.message || 'Unknown error'}`);
          }

          return story;
        });

        await Promise.all(uploadPromises);
        toast.success(
          `${storiesData.length} ${storiesData.length === 1 ? 'story' : 'stories'} created successfully!`
        );
        onSuccess?.();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to create stories';
        toast.error(message);
      }
    },
    [onSuccess]
  );

  return {
    handleStatusImageSelect,
    handleStoryCreate,
    handleMultipleStoriesCreate,
  };
}
