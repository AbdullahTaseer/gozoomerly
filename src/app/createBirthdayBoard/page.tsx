"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CloudUpload } from "lucide-react";

import AddWishImg from "@/assets/svgs/add-wish.svg";
import AppLogo from "@/assets/svgs/Zoomerly.svg";
import Particles from "@/assets/svgs/why-people-love-particles.svg";
import ArrowRight from "@/assets/svgs/ArrowRight.svg";
import ArrowLeft from "@/assets/svgs/ArrowLeft.svg";
import GlobalModal from "@/components/modals/GlobalModal";
import AddFilesModal from "@/components/modals/AddFilesModal";
import AddGift from "@/components/compaignSections/AddGift";
import WhoCanJoin from "@/components/compaignSections/WhoCanJoin";
import YourBoardIsLive from "@/components/compaignSections/YourBoardIsLive";
import GlobalInput from "@/components/inputs/GlobalInput";
import DateInputWithIcon from "@/components/inputs/DateInputWithIcon";
import PhoneInput from "@/components/inputs/PhoneInput";
import GlobalButton from "@/components/buttons/GlobalButton";
import { authService } from '@/lib/supabase/auth';
import {
  updateBoard,
  getBoardTypeFields,
  BoardTypeField,
  addBoardGiftOptions,
  publishBoard,
  Board,
  wishIdFromCreateWishResponse,
  resolveWishIdAfterCreate,
} from '@/lib/supabase/boards';
import { useCreateBirthdayBoard } from '@/hooks/useCreateBirthdayBoard';
import { CreateBirthdayBoardInput } from '@/types/board';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from '@/lib/supabase/client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storageBuckets';
import { Skeleton } from '@/components/skeletons';
import * as Switch from '@radix-ui/react-switch';
import toast from 'react-hot-toast';
import { buildBoardUrl } from '@/lib/utils/siteUrl';

const CreateBirthdayBoard = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [boardId, setBoardId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedBoardType, setSelectedBoardType] = useState<{ id: string | number, name: string, slug: string } | null>(null);
  const [boardTypeFields, setBoardTypeFields] = useState<BoardTypeField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([]);
  const [selectedMusicId, setSelectedMusicId] = useState<number | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [profilePhotoError, setProfilePhotoError] = useState<string | null>(null);
  const [surpriseModeEnabled, setSurpriseModeEnabled] = useState(false);
  const [creatorName, setCreatorName] = useState<string>('');
  const [creatorProfilePic, setCreatorProfilePic] = useState<string>('');
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<Array<{ id: string; url: string; type: 'image' | 'video' }>>([]);
  /** Draft wish for step 3 uploads — storage path is `{boardId}/{wishId}/…` */
  const [draftWishId, setDraftWishId] = useState<string | null>(null);
  const [openingWishModal, setOpeningWishModal] = useState(false);
  const [boardPublishedFromFlow, setBoardPublishedFromFlow] = useState(false);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { createBirthdayBoard, isLoading: isCreatingBoard, error: createBoardError } = useCreateBirthdayBoard();

  const groupFieldsByStep = () => {
    if (!boardTypeFields.length) return {};

    return {
      step1: boardTypeFields.filter(f => ['theme_color', 'first_name', 'last_name', 'date_of_birth', 'hometown', 'phone', 'email', 'profile_photo_url'].includes(f.field_key)),
      step2: boardTypeFields.filter(f => ['title', 'description', 'goal_headline', 'goal_amount', 'suggested_amount'].includes(f.field_key)),
      step3: boardTypeFields.filter(f => ['music_track_id', 'story_overlays', 'media_upload'].includes(f.field_key)),
      step4: boardTypeFields.filter(f => ['privacy', 'allow_invites', 'invites_can_invite'].includes(f.field_key)),
    };
  };

  const fieldGroups = groupFieldsByStep();

  const progress = step === 1
    ? 20
    : step === 2
      ? 35
      : step === 3
        ? 50
        : step === 4
          ? 65
          : step === 5
            ? 80
            : step === 6
              ? 90
              : step === 7
                ? 99 : 0

  useEffect(() => {
    checkAuth();

    const savedBoardType = localStorage.getItem('selectedBoardType');
    if (savedBoardType) {
      try {
        const boardType = JSON.parse(savedBoardType);
        setSelectedBoardType(boardType);
        fetchBoardTypeFields(boardType.id);

        const currentBoardId = localStorage.getItem('currentBoardId');
        const savedBoardData = localStorage.getItem('boardTypeFields');

        if (!currentBoardId && savedBoardData) {

          localStorage.removeItem('boardTypeFields');
          localStorage.removeItem('currentBoardId');

          setCustomFieldValues({});
          setProfilePhotoPreview(null);
          setStep(1);
          setBoardId(null);
        } else if (currentBoardId && savedBoardData) {

          try {
            const savedData = JSON.parse(savedBoardData);
            setCustomFieldValues(savedData);

            if (savedData.profile_photo_url) {
              setProfilePhotoPreview(savedData.profile_photo_url);
            }
            setBoardId(currentBoardId);
          } catch (error) {
          }
        }
      } catch (error) {
        router.push('/compaign');
      }
    } else {

      router.push('/compaign');
    }
  }, []);

  useEffect(() => {
    setBoardPublishedFromFlow(false);
  }, [boardId]);

  const checkAuth = async () => {
    const user = await authService.getUser();
    if (!user) {
      router.push('/signin');
    } else {
      setUserId(user.id);

      const supabase = createClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, profile_pic_url')
        .eq('id', user.id)
        .single();
      if (profile) {
        setCreatorName(profile.name || '');
        setCreatorProfilePic(profile.profile_pic_url || '');
      }
    }
  };

  const fetchBoardTypeFields = async (boardTypeId: string) => {
    try {
      const { data, error } = await getBoardTypeFields(boardTypeId);
      if (data && !error) {
        setBoardTypeFields(data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldKey: string, value: any) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
    
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfilePhotoError('Image size should be less than 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setProfilePhotoError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    setUploadingProfilePhoto(true);
    setProfilePhotoError(null);

    try {
      const user = await authService.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `board-profile-${user.id}-${Date.now()}.${fileExt}`;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKETS.WISH_MEDIA}/${fileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': file.type,
            'Cache-Control': 'max-age=3600'
          },
          body: uint8Array
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to upload image: ${error}`);
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKETS.WISH_MEDIA}/${fileName}`;

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      handleFieldChange('profile_photo_url', publicUrl);
    } catch (err) {
      setProfilePhotoError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      setStep(step + 1);
      return;
    }

    if (step === 2 && !boardId && userId && selectedBoardType) {
      setCreating(true);
      try {

        const getThemeName = (color: string) => {
          const themeMap: Record<string, string> = {
            '#CE7ADD': 'fun-colorful',
            '#FBE66C': 'elegant-gold',
            '#F6CDD7': 'love',
            '#B0F3EF': 'cool',
            '#D1F6B5': 'kids',
            '#C1F4D2': 'success',
            '#FBEC93': 'travel'
          };
          return themeMap[color] || 'fun-colorful';
        };

        const boardTypeId = selectedBoardType.id;
        if (!boardTypeId) {
          toast.error('Invalid board type. Please go back and select a board type again.');
          setCreating(false);
          return;
        }

        const boardData: CreateBirthdayBoardInput = {
          p_board_type_id: boardTypeId,
          p_title: customFieldValues.title || `${selectedBoardType.name} Board`,
          p_honoree_first_name: customFieldValues.first_name || '',
          p_honoree_last_name: customFieldValues.last_name || '',
          p_honoree_date_of_birth: customFieldValues.date_of_birth || '',
          p_honoree_hometown: customFieldValues.hometown || '',
          p_description: customFieldValues.description || undefined,
          p_honoree_phone: customFieldValues.phone || undefined,
          p_honoree_email: customFieldValues.email || undefined,
          p_honoree_profile_photo_url: customFieldValues.profile_photo_url || undefined,
          p_honoree_theme_color: customFieldValues.theme_color || '#CE7ADD',
          p_surprise_mode_enabled: surpriseModeEnabled,
          p_theme: getThemeName(customFieldValues.theme_color || '#CE7ADD'),
          p_target_amount: customFieldValues.goal_amount ? parseFloat(customFieldValues.goal_amount) : undefined,
          p_expiry_date: customFieldValues.deadline_date || undefined,
          p_currency: 'USD',
          p_privacy: (customFieldValues.privacy as 'public' | 'private') || 'public',
          p_allow_invites: customFieldValues.allow_invites ?? true,
          p_invites_can_invite: customFieldValues.invites_can_invite ?? false,
        };

        const createdBoard = await createBirthdayBoard(boardData);

        if (!createdBoard) {
          toast.error(`Failed to create board: ${createBoardError || 'Unknown error'}`);
          return;
        }

        setBoardId(createdBoard.id);
        localStorage.setItem('currentBoardId', createdBoard.id);
        localStorage.setItem('boardTypeFields', JSON.stringify(customFieldValues));
        setStep(step + 1);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        toast.error(`An unexpected error occurred: ${errorMessage}`);
      } finally {
        setCreating(false);
      }
      return;
    }

    if (boardId && step === 2) {
      setCreating(true);
      try {
        const updates: Partial<Board> = {};

        if (customFieldValues.title) {
          updates.title = customFieldValues.title;
        }

        if (customFieldValues.description) {
          updates.description = customFieldValues.description;
        }

        updates.honoree_details = {
          first_name: customFieldValues.first_name,
          last_name: customFieldValues.last_name,
          date_of_birth: customFieldValues.date_of_birth,
          hometown: customFieldValues.hometown,
          phone: customFieldValues.phone,
          email: customFieldValues.email,
          profile_photo_url: customFieldValues.profile_photo_url,
          theme_color: customFieldValues.theme_color || '#9B59B6',
        };

        if (customFieldValues.goal_amount) {
          updates.goal_type = 'monetary';
          updates.goal_amount = parseFloat(customFieldValues.goal_amount);
        } else {
          updates.goal_type = 'nonmonetary';
        }

        const { data, error } = await updateBoard(boardId, updates);

        if (error || !data) {
          const errorMessage = error?.message || 'Failed to update board';
          toast.error(`Failed to update board: ${errorMessage}`);
          return;
        }

        localStorage.setItem('boardTypeFields', JSON.stringify(customFieldValues));
        setStep(step + 1);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        toast.error(`An unexpected error occurred: ${errorMessage}`);
      } finally {
        setCreating(false);
      }
      return;
    }

    setStep(step + 1);
  };

  const handleStep5Next = async () => {
    if (boardId) {
      setCreating(true);
      try {
        const updates: Partial<Board> = {};

        updates.privacy = (customFieldValues.privacy as 'public' | 'private' | 'circle_only') || 'public';
        updates.allow_invites = customFieldValues.allow_invites !== undefined ? customFieldValues.allow_invites : true;
        updates.invites_can_invite = customFieldValues.invites_can_invite !== undefined ? customFieldValues.invites_can_invite : false;

        const { data } = await updateBoard(boardId, updates);

        if (data) {
          localStorage.setItem('boardTypeFields', JSON.stringify(customFieldValues));
        }
      } catch (err) {
      } finally {
        setCreating(false);
      }
    }

    setStep(6);
  };

  const handleStep6Next = async () => {
    if (!boardId) {
      toast.error('No board found. Please go back and complete step 2.');
      return;
    }

    setCreating(true);

    try {
      // Only seed the board with a preset gift option when the user did NOT
      // create a payment intent in step 4. If a payment intent exists, the
      // selection represents a real contribution, not a board-level option.
      if (savedGiftData && !savedGiftData.paymentIntent) {
        const giftOptionData = [{
          amount: savedGiftData.amount,
          label: savedGiftData.label,
          description: savedGiftData.message || undefined,
          is_custom: savedGiftData.isCustom,
        }];

        const giftResult = await addBoardGiftOptions(boardId, giftOptionData);
        if (giftResult.error) {
          toast.error(`Failed to save gift option: ${giftResult.error.message || 'Unknown error'}`);
        }
      }

      if (userId && uploadedMediaIds.length > 0) {
        const firstName = customFieldValues.first_name || '';
        const wishContent = `Happy Birthday, ${firstName}! Here's to an amazing year ahead! 🎉`;

        const supabase = createClient();

        if (draftWishId) {
          const { error: updErr } = await supabase
            .from('wishes')
            .update({ content: wishContent, media_ids: uploadedMediaIds })
            .eq('id', draftWishId);
          if (updErr) {
            toast.error(updErr.message || 'Failed to finalize wish');
          }
        } else {
          const { error: wishError } = await supabase.rpc('create_wish', {
            p_sender_id: userId,
            p_board_id: boardId,
            p_content: wishContent,
            p_media_ids: uploadedMediaIds,
            p_audio_url: null,
            p_max_media_count: 10,
            p_max_content_length: 1000,
          });

          if (wishError) {
            const { error: directError } = await supabase
              .from('wishes')
              .insert({
                sender_id: userId,
                board_id: boardId,
                content: wishContent,
                media_ids: uploadedMediaIds,
              });

            if (directError) {
            }
          }
        }
      }

      localStorage.removeItem('selectedBoardType');
      setStep(7);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`An unexpected error occurred: ${errorMessage}`);
    } finally {
      setCreating(false);
    }
  };

  const handlePublishBoard = async () => {
    if (!boardId) {
      toast.error('No board found to publish.');
      return;
    }

    if (!userId) {
      toast.error('User not authenticated. Please sign in again.');
      router.push('/signin');
      return;
    }

    setCreating(true);

    try {
      const coverMediaId =
        uploadedMediaUrls.find((m) => m.type === 'image')?.id ?? uploadedMediaIds[0] ?? null;

      const { data, error } = await publishBoard(
        boardId,
        coverMediaId ? { coverMediaId } : undefined,
      );

      if (error || !data) {
        const errorMessage = error?.message || 'Failed to publish board';
        toast.error(`Failed to publish board: ${errorMessage}`);
        return;
      }

      localStorage.removeItem('boardTypeFields');
      localStorage.removeItem('currentBoardId');

      toast.success('Board published successfully!');
      setBoardPublishedFromFlow(true);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`An unexpected error occurred: ${errorMessage}`);
    } finally {
      setCreating(false);
    }
  };

  const ensureDraftWish = async (): Promise<string | null> => {
    if (draftWishId) return draftWishId;
    if (!boardId || !userId) {
      toast.error('Board or user not ready.');
      return null;
    }
    const supabase = createClient();
    const placeholder = `Happy Birthday, ${customFieldValues.first_name || 'friend'}!`;
    const { data: rpcData, error: rpcErr } = await supabase.rpc('create_wish', {
      p_sender_id: userId,
      p_board_id: boardId,
      p_content: placeholder,
      p_media_ids: [],
      p_audio_url: null,
      p_max_media_count: 10,
      p_max_content_length: 1000,
    });
    let id: string | null = !rpcErr ? wishIdFromCreateWishResponse(rpcData) : null;
    if (rpcErr) {
      const { data: directData, error: directError } = await supabase
        .from('wishes')
        .insert({
          sender_id: userId,
          board_id: boardId,
          content: placeholder,
          media_ids: [],
        })
        .select()
        .single();
      if (directError || !directData?.id) {
        toast.error(directError?.message || 'Failed to prepare wish');
        return null;
      }
      id = directData.id;
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
    } else if (!id) {
      id = await resolveWishIdAfterCreate(supabase, boardId, userId);
    }
    if (!id) {
      toast.error('Could not read wish id from server.');
      return null;
    }
    setDraftWishId(id);
    return id;
  };

  const handleMediaUploaded = async (
    mediaIds: string[],
    musicId?: number,
    mediaUrls?: Array<{ id: string; url: string; type: 'image' | 'video' }>,
    linkedWishId?: string,
  ) => {
    setUploadedMediaIds(mediaIds);
    if (mediaUrls) {
      setUploadedMediaUrls(mediaUrls);
    }
    if (musicId) {
      setSelectedMusicId(musicId);
      handleFieldChange('music_track_id', musicId);
    }

    const wishIdForRow = linkedWishId ?? draftWishId;
    if (wishIdForRow && mediaIds.length > 0) {
      const supabase = createClient();
      const { error: wErr } = await supabase
        .from('wishes')
        .update({ media_ids: mediaIds })
        .eq('id', wishIdForRow);
      if (wErr) {
        toast.error(wErr.message || 'Failed to link media to wish');
      }
    }

    const board = boardId ?? localStorage.getItem('currentBoardId');
    if (board && mediaIds.length > 0) {
      const coverMediaId =
        mediaUrls?.find((m) => m.type === 'image')?.id ?? mediaIds[0];
      const { error: coverError } = await updateBoard(board, {}, { coverMediaId });
      if (coverError) {
        toast.error(coverError.message || 'Failed to set board cover');
      }
    }
  };

  const handleStep3Next = async () => {
    if (boardId && selectedMusicId) {
      setCreating(true);
      try {
        const currentHonoreeDetails = {
          first_name: customFieldValues.first_name,
          last_name: customFieldValues.last_name,
          date_of_birth: customFieldValues.date_of_birth,
          hometown: customFieldValues.hometown,
          phone: customFieldValues.phone,
          email: customFieldValues.email,
          profile_photo_url: customFieldValues.profile_photo_url,
          theme_color: customFieldValues.theme_color || '#9B59B6',
        };

        const updates: Partial<Board> = {
          honoree_details: {
            ...currentHonoreeDetails,
            music_track_id: selectedMusicId,
          }
        };

        const { data } = await updateBoard(boardId, updates);

        if (data) {
          localStorage.setItem('boardTypeFields', JSON.stringify({
            ...customFieldValues,
            music_track_id: selectedMusicId
          }));
        }
      } catch (err) {
      } finally {
        setCreating(false);
      }
    }

    setStep(4);
  };

  const [savedGiftData, setSavedGiftData] = useState<any>(null);

  const handleGiftPayment = () => {
    setStep(5);
  };

  const handleGiftSaved = (giftData: any) => {
    setSavedGiftData(giftData);
  };

  const renderField = (field: BoardTypeField) => {
    switch (field.field_type) {
      case 'text':
        return (
          <GlobalInput
            type="text"
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            width="100%"
            height="48px"
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            rows={4}
          />
        );

      case 'number':
        return (
          <GlobalInput
            type="number"
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(e) => handleFieldChange(field.field_key, parseFloat(e.target.value) || 0)}
            width="100%"
            height="48px"
          />
        );

      case 'date':
        return (
          <DateInputWithIcon
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(value) => handleFieldChange(field.field_key, value)}
            width="100%"
            height="48px"
          />
        );

      case 'select':
        const selectOptions = field.options?.values || [];
        return (
          <Select
            value={customFieldValues[field.field_key] || ""}
            onValueChange={(value) => handleFieldChange(field.field_key, value)}
          >
            <SelectTrigger className="w-full border bg-white border-[#2E2C39] !h-[46px]">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>

            <SelectContent>
              {selectOptions.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={customFieldValues[field.field_key] || false}
              onChange={(e) => handleFieldChange(field.field_key, e.target.checked)}
              className="w-4 h-4 accent-pink-500"
            />
            <span>{field.placeholder || field.label}</span>
          </label>
        );

      case 'email':
        return (
          <GlobalInput
            type="email"
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            width="100%"
            height="48px"
          />
        );

      case 'phone':
        return (
          <PhoneInput
            id={field.field_key}
            title={field.label}
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(value) => handleFieldChange(field.field_key, value)}
            width="100%"
            height="48px"
            required={field.is_required || false}
          />
        );

      case 'url':
        return (
          <GlobalInput
            type="url"
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            width="100%"
            height="48px"
          />
        );

      case 'file':
        return (
          <GlobalInput
            type="file"
            placeholder={field.placeholder || field.label}
            onChange={(e) => handleFieldChange(field.field_key, e.target.files?.[0])}
            width="100%"
            height="48px"
            inputClassName="pt-3"
          />
        );

      default:
        return (
          <GlobalInput
            type="text"
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            width="100%"
            height="48px"
          />
        );
    }
  };

  return (

    <>
      <div className="relative min-h-screen overflow-x-clip bg-[#F7F7F7] p-4">
        <div className="flex justify-between gap-3 max-md:flex-col items-center">
          <Image onClick={() => router.push("/")} className="cursor-pointer relative z-10" src={AppLogo} alt="App Logo" />
          <h2 className="text-center text-[32px] max-[700px]:text-[24px] font-bold">
            Create {selectedBoardType?.name || 'Birthday'} Board
          </h2>
          <div className="w-[100px] max-md:hidden" />
        </div>

        <Image src={Particles} alt="" className="absolute top-10 left-10" />
        <Image src={Particles} alt="" className="absolute bottom-10 right-10" />

        <div className="w-full mx-auto max-w-2xl relative z-10">
          <div className="space-y-1">
            <div className="h-1 bg-[#D9D9D9] rounded-full overflow-hidden mt-4">
              <div
                className="h-1 bg-[#F43C83] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs">{progress}% Complete</p>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="bg-white rounded-xl p-6 max-[420px]:p-4 shadow-lg border border-pink-200 space-y-4">
                <Skeleton className="h-6 w-2/3 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="space-y-3 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
                <Skeleton className="h-11 w-full rounded-full" />
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div className="bg-white rounded-xl p-6 max-[420px]:p-4 shadow-lg border border-pink-200">
                    <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
                      Let's make someone's birthday unforgettable 🎉
                    </p>
                    <p className="text-sm text-center mt-1">
                      Pick a theme and tell us about the birthday star
                    </p>

                    <div className="my-6">
                      <div className="grid grid-cols-7 gap-3">
                        {[
                          { name: 'Fun & Colorful', color: '#CE7ADD', selected: true },
                          { name: 'Elegant & Gold', color: '#FBE66C' },
                          { name: 'Love', color: '#F6CDD7' },
                          { name: 'Love', color: '#B0F3EF' },
                          { name: 'Kids', color: '#D1F6B5' },
                          { name: 'Success', color: '#C1F4D2' },
                          { name: 'Travel', color: '#FBEC93' }
                        ].map((theme, index) => (
                          <div key={index} className="text-center">
                            <div
                              onClick={() => handleFieldChange('theme_color', theme.color)}
                              className={`mx-auto w-11 max-[600px]:w-7 h-11 max-[600px]:h-7 rounded-full ring-offset-3 ring-2 cursor-pointer transition-all ${customFieldValues.theme_color === theme.color || (!customFieldValues.theme_color && theme.selected)
                                ? ' ring-black'
                                : 'ring-[#F2F2F2]'
                                }`}
                              style={{ backgroundColor: theme.color }}
                            />
                            <p className="text-xs mt-2">{theme.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">

                      {fieldGroups.step1?.filter(f => f.field_key !== 'theme_color' && f.field_key !== 'profile_photo_url').map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium mb-2">
                            {field.label}
                            {field.is_required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderField(field)}
                          {field.help_text && (
                            <p className="text-sm text-gray-500 mt-1">{field.help_text}</p>
                          )}
                        </div>
                      ))}
                      {}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Profile Photo
                          {fieldGroups.step1?.find(f => f.field_key === 'profile_photo_url')?.is_required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        <div className="relative">
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!uploadingProfilePhoto && profilePhotoInputRef.current) {
                                profilePhotoInputRef.current.click();
                              }
                            }}
                            className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${uploadingProfilePhoto
                              ? 'border-gray-300 bg-gray-50 cursor-wait'
                              : profilePhotoPreview || customFieldValues.profile_photo_url
                                ? 'border-[#F43C83] bg-pink-50'
                                : 'border-[#B2B2B2] hover:border-[#F43C83] hover:bg-gray-50'
                              }`}
                          >
                            {uploadingProfilePhoto ? (
                              <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F43C83] border-t-transparent mb-2" />
                                <p className="text-sm text-gray-500">Uploading...</p>
                              </div>
                            ) : profilePhotoPreview || customFieldValues.profile_photo_url ? (
                              <div className="flex flex-col items-center">
                                <img
                                  src={profilePhotoPreview || customFieldValues.profile_photo_url}
                                  alt="Profile preview"
                                  className="h-20 w-20 rounded-full object-cover mb-2 border-2 border-white shadow-md"
                                />
                                <p className="text-sm text-gray-600">Click to change photo</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className="bg-[#EEEEEE] flex justify-center items-center h-9 w-9 rounded-full mb-2">
                                  <CloudUpload className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">Upload Profile Photo</p>
                              </div>
                            )}
                          </div>
                          <input
                            ref={profilePhotoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoUpload}
                            onClick={(e) => {
                              // Reset value on click to allow selecting the same file again
                              (e.target as HTMLInputElement).value = '';
                            }}
                            className="hidden"
                            disabled={uploadingProfilePhoto}
                          />
                          {profilePhotoError && (
                            <p className="text-sm text-red-500 mt-1">{profilePhotoError}</p>
                          )}
                          {fieldGroups.step1?.find(f => f.field_key === 'profile_photo_url')?.help_text && (
                            <p className="text-sm text-gray-500 mt-1">
                              {fieldGroups.step1.find(f => f.field_key === 'profile_photo_url')?.help_text}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#F4F4F4] text-black flex justify-between items-center p-4 rounded-lg">
                        <div>
                          <p className="text-md font-medium">Surprise Mode</p>
                          <p className="text-sm">Hide messages from the honoree until the day.</p>
                        </div>
                        <Switch.Root
                          checked={surpriseModeEnabled}
                          onCheckedChange={setSurpriseModeEnabled}
                          className="w-11 h-6 bg-[#0D0C10] rounded-full relative data-[state=checked]:bg-pink-500"
                        >
                          <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5.5" />
                        </Switch.Root>
                      </div>

                      <GlobalButton
                        title="Next"
                        icon={ArrowRight}
                        onClick={handleNextStep}
                        height="48px"
                        width="100%"
                        className="flex-row-reverse"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div>
                      <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
                        Make their wish come true 💫
                      </p>
                      <p className="text-sm text-center mt-1">
                        Tell everyone what we're aiming for and why it matters.
                      </p>
                    </div>
                    <div className="space-y-4 mt-6">
                      {/* Goal Field */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Goal <span className="text-pink-500">*</span>
                        </label>
                        <GlobalInput
                          type="text"
                          placeholder="Let's send Sean to the Caribbean!"
                          value={customFieldValues.title || ''}
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          width="100%"
                          height="48px"
                        />
                      </div>

                      {/* Target Amount Field */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Target Amount
                        </label>
                        <GlobalInput
                          type="text"
                          placeholder="$3000"
                          value={customFieldValues.goal_amount ? `$${customFieldValues.goal_amount}` : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            handleFieldChange('goal_amount', value);
                          }}
                          width="100%"
                          height="48px"
                        />
                      </div>

                      {/* Description Field */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Description
                        </label>
                        <textarea
                          placeholder="Sean has dreamed of visiting the Caribbean for years. He's been working so hard and never takes time for himself. This year, with all of us coming together on BirthdayText.com, we can finally make it happen. Let's give him the gift of sunshine, ocean waves, and the biggest smile we've ever seen!"
                          value={customFieldValues.description || ''}
                          onChange={(e) => handleFieldChange('description', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F43C83] resize-none"
                          rows={5}
                        />
                      </div>

                      {/* Goal Progress */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Goal Progress
                        </label>
                        <div className="w-full">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                              style={{ width: '0%' }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>$0 raised</span>
                            <span>${customFieldValues.goal_amount || '0'} goal</span>
                          </div>
                        </div>
                      </div>

                      {/* Render any additional fields from board type */}
                      {fieldGroups.step2?.map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium mb-2">
                            {field.label}
                            {field.is_required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderField(field)}
                          {field.help_text && (
                            <p className="text-sm text-gray-500 mt-1">{field.help_text}</p>
                          )}
                        </div>
                      ))}

                      <GlobalButton
                        title={creating ? "Creating..." : "Continue"}
                        onClick={handleNextStep}
                        height="48px"
                        width="100%"
                        disabled={creating}
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div>
                      <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
                        Add your wish 💌
                      </p>
                      <p className="text-sm text-center mt-1">
                        Make it personal your photos, videos, and voice will be part of their forever memory Photos
                      </p>
                    </div>

                    <div className="my-6">
                      <div
                        onClick={async () => {
                          if (!boardId || !userId) {
                            toast.error('Please sign in and complete previous steps.');
                            return;
                          }
                          setOpeningWishModal(true);
                          try {
                            const id = await ensureDraftWish();
                            if (!id) return;
                            setModalOpen(true);
                          } finally {
                            setOpeningWishModal(false);
                          }
                        }}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#F43C83] transition-all duration-300"
                      >
                        <Image src={AddWishImg} alt='' className='mx-auto' />
                        <p className="text-gray-700 mt-2 font-medium">
                          {openingWishModal ? 'Preparing…' : 'Click to upload photos, videos & select music'}
                        </p>
                        {uploadedMediaIds.length > 0 && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ {uploadedMediaIds.length} media file{uploadedMediaIds.length > 1 ? 's' : ''} uploaded
                          </p>
                        )}
                        {selectedMusicId && (
                          <p className="text-sm text-green-600 mt-1">✓ Music selected</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <GlobalButton
                        title="Back"
                        onClick={() => setStep(step - 1)}
                        className="bg-gray-300 text-gray-700"
                        height="48px"
                        width="100px"
                        icon={ArrowLeft}
                        disabled={creating}
                      />
                      <GlobalButton
                        title={creating ? "Updating..." : "Next"}
                        icon={ArrowRight}
                        onClick={handleStep3Next}
                        height="48px"
                        width="120px"
                        className="flex-row-reverse"
                        disabled={creating}
                      />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <AddGift
                      goToPayment={handleGiftPayment}
                      boardId={boardId ?? undefined}
                      onGiftSaved={handleGiftSaved}
                    />
                    <div className="flex justify-center">
                      <button
                        onClick={() => setStep(3)}
                        className="text-gray-600 hover:text-gray-800 underline text-sm"
                      >
                        ← Go Back
                      </button>
                      <span className="mx-4 text-gray-400">|</span>
                      <button
                        onClick={() => setStep(5)}
                        className="text-gray-600 hover:text-gray-800 underline text-sm"
                      >
                        Skip Gift →
                      </button>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-center text-[20px] max-[600px]:text-[16px] font-bold">Privacy Settings</h3>
                    <div className="space-y-4">
                      {fieldGroups.step4 && fieldGroups.step4.length > 0 ? (
                        fieldGroups.step4.map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-medium mb-1">
                              {field.label}
                              {field.is_required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderField(field)}
                            {field.help_text && (
                              <p className="text-sm text-gray-500 mt-1">{field.help_text}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          {/* Privacy Field */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Privacy
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Select
                              value={customFieldValues.privacy || "public"}
                              onValueChange={(value) => handleFieldChange('privacy', value)}
                            >
                              <SelectTrigger className="w-full border bg-white border-[#2E2C39] !h-[46px]">
                                <SelectValue placeholder="Select Privacy" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-sm text-gray-500 mt-1">
                              Choose who can view this board
                            </p>
                          </div>

                          {/* Allow Invites Field */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Allow Invites
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={customFieldValues.allow_invites ?? true}
                                onChange={(e) => handleFieldChange('allow_invites', e.target.checked)}
                                className="w-4 h-4 accent-pink-500"
                              />
                              <span>Allow people to invite others to this board</span>
                            </label>
                          </div>

                          {/* Invites Can Invite Field */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Invites Can Invite
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={customFieldValues.invites_can_invite ?? false}
                                onChange={(e) => handleFieldChange('invites_can_invite', e.target.checked)}
                                className="w-4 h-4 accent-pink-500"
                              />
                              <span>Allow invited people to invite others</span>
                            </label>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between mt-6">
                        <GlobalButton
                          title="Back"
                          onClick={() => setStep(step - 1)}
                          className="bg-gray-300 text-gray-700"
                          height="48px"
                          width="100px"
                          icon={ArrowLeft}
                          disabled={creating}
                        />
                        <GlobalButton
                          title={creating ? "Updating..." : "Continue"}
                          onClick={handleStep5Next}
                          height="48px"
                          width="160px"
                          disabled={creating}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 &&
                  <WhoCanJoin goToLiveBoard={handleStep6Next} />
                }

                {step === 7 &&
                  <YourBoardIsLive
                    onPublish={boardPublishedFromFlow ? undefined : handlePublishBoard}
                    isPublishing={creating}
                    isPublished={boardPublishedFromFlow}
                    shareUrl={
                      boardPublishedFromFlow && boardId ? buildBoardUrl(boardId) : undefined
                    }
                    onDashboardNavigate={
                      boardPublishedFromFlow
                        ? () => {
                            setCustomFieldValues({});
                            setProfilePhotoPreview(null);
                          }
                        : undefined
                    }
                    boardData={{
                      title: customFieldValues.title,
                      firstName: customFieldValues.first_name,
                      lastName: customFieldValues.last_name,
                      hometown: customFieldValues.hometown,
                      dateOfBirth: customFieldValues.date_of_birth,
                      description: customFieldValues.description,
                      goalAmount: customFieldValues.goal_amount ? parseFloat(customFieldValues.goal_amount) : 0,
                      profilePhotoUrl: customFieldValues.profile_photo_url,
                      themeColor: customFieldValues.theme_color,
                    }}
                    creatorData={{
                      name: creatorName,
                      profilePicUrl: creatorProfilePic,
                    }}
                    uploadedMedia={uploadedMediaUrls}
                  />
                }
              </>
            )}
          </div>
        </div>
      </div>

      <GlobalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        modalHeader={false}
        className="w-[600px] max-[768px]:w-[90vw] max-h-[90vh]">
        <AddFilesModal
          doneOnclick={() => {
            setStep(3)
            setModalOpen(false)
          }}
          onClose={() => setModalOpen(false)}
          boardId={boardId || undefined}
          wishId={draftWishId ?? undefined}
          onMediaUploaded={handleMediaUploaded}
        />
      </GlobalModal>
    </>
  );
};

export default CreateBirthdayBoard;
