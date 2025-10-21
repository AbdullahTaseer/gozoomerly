"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import AddWishImg from "@/assets/svgs/add-wish.svg";
import AppLogo from "@/assets/svgs/Zoomerly.svg";
import Particles from "@/assets/svgs/why-people-love-particles.svg";
import ArrowRight from "@/assets/svgs/ArrowRight.svg";
import ArrowLeft from "@/assets/svgs/ArrowLeft.svg";
import AddYourWish from "@/components/compaignSections/AddYourWish";
import PickThemeForm from "@/components/compaignSections/PickThemeForm";
import MakeWishTrueForm from "@/components/compaignSections/MakeWishTrueForm";
import GlobalModal from "@/components/modals/GlobalModal";
import AddFilesModal from "@/components/modals/AddFilesModal";
import AddGift from "@/components/compaignSections/AddGift";
import ContinuePayment from "@/components/compaignSections/ContinuePayment";
import WhoCanJoin from "@/components/compaignSections/WhoCanJoin";
import YourBoardIsLive from "@/components/compaignSections/YourBoardIsLive";
import GlobalInput from "@/components/inputs/GlobalInput";
import GlobalButton from "@/components/buttons/GlobalButton";
import { authService } from '@/lib/supabase/auth';
import {
  createBoard,
  updateBoard,
  getBoardTypeFields,
  BoardTypeField,
  publishBoard,
  CreateBoardInput,
  addBoardGiftOptions
} from '@/lib/supabase/boards';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CreateBirthdayBoard = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [boardId, setBoardId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedBoardType, setSelectedBoardType] = useState<{ id: string, name: string, slug: string } | null>(null);
  const [boardTypeFields, setBoardTypeFields] = useState<BoardTypeField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  // Group fields by step based on mockup screenshots
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
      ? 40
      : step === 3
        ? 60
        : step === 4
          ? 80
          : step === 5
            ? 90
            : step === 6
              ? 99 : 0

  useEffect(() => {
    checkAuth();

    // Get selected board type from localStorage
    const savedBoardType = localStorage.getItem('selectedBoardType');
    if (savedBoardType) {
      try {
        const boardType = JSON.parse(savedBoardType);
        setSelectedBoardType(boardType);
        fetchBoardTypeFields(boardType.id);
        // Don't remove it yet - will remove after board is created
      } catch (error) {
        console.error('Error parsing board type:', error);
        router.push('/compaign');
      }
    } else {
      // No board type selected, redirect back to selection
      console.log('No board type in localStorage, redirecting to /compaign');
      router.push('/compaign');
    }
  }, []);

  const checkAuth = async () => {
    const user = await authService.getUser();
    if (!user) {
      router.push('/signin');
    } else {
      setUserId(user.id);
    }
  };

  const fetchBoardTypeFields = async (boardTypeId: string) => {
    try {
      const { data, error } = await getBoardTypeFields(boardTypeId);
      if (data && !error) {
        setBoardTypeFields(data);
      }
    } catch (err) {
      console.error('Error fetching board type fields:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldKey: string, value: any) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleCreateBoard = async () => {
    if (!userId || !selectedBoardType || creating) return;

    setCreating(true);

    try {
      // Create board with all the collected data
      const boardData: CreateBoardInput = {
        title: customFieldValues.title || `${selectedBoardType.name} Board`,
        description: customFieldValues.description || '',
        board_type_id: selectedBoardType.id,
        honoree_details: {
          first_name: customFieldValues.first_name,
          last_name: customFieldValues.last_name,
          date_of_birth: customFieldValues.date_of_birth,
          hometown: customFieldValues.hometown,
          phone: customFieldValues.phone,
          email: customFieldValues.email,
          profile_photo_url: customFieldValues.profile_photo_url,
          theme_color: customFieldValues.theme_color || '#9B59B6', // Default to Fun & Colorful
        },
        goal_type: customFieldValues.goal_amount ? 'monetary' : 'non_monetary',
        goal_amount: customFieldValues.goal_amount ? parseFloat(customFieldValues.goal_amount) : undefined,
        currency: 'USD',
        deadline_date: customFieldValues.deadline_date,
        privacy: customFieldValues.privacy || 'public',
        allow_invites: customFieldValues.allow_invites ?? true,
        invites_can_invite: customFieldValues.invites_can_invite ?? false,
      };

      console.log('Creating board with data:', boardData);

      const { data, error } = await createBoard(userId, boardData);
      if (data && !error) {
        setBoardId(data.id);

        // Store board data for use in other steps
        localStorage.setItem('currentBoardId', data.id);
        localStorage.setItem('boardTypeFields', JSON.stringify(customFieldValues));

        // Add gift options if suggested amounts were set
        if (customFieldValues.suggested_amount) {
          try {
            // Handle different input formats
            let amounts: number[] = [];

            if (typeof customFieldValues.suggested_amount === 'string') {
              // If it's a comma-separated string like "25,50,100"
              amounts = customFieldValues.suggested_amount
                .split(',')
                .map((a: string) => parseFloat(a.trim()))
                .filter((n: number) => !isNaN(n) && n > 0);
            } else if (typeof customFieldValues.suggested_amount === 'number') {
              // If it's a single number
              amounts = [customFieldValues.suggested_amount];
            } else if (Array.isArray(customFieldValues.suggested_amount)) {
              // If it's already an array
              amounts = customFieldValues.suggested_amount
                .map((a: any) => parseFloat(a))
                .filter((n: number) => !isNaN(n) && n > 0);
            }

            if (amounts.length > 0) {
              await addBoardGiftOptions(data.id, amounts.map((amount: number) => ({
                amount,
                label: `$${amount}`,
              })));
            }
          } catch (err) {
            console.error('Error adding gift options:', err);
            // Continue without gift options - not critical for board creation
          }
        }

        // Now safe to remove the board type selection
        localStorage.removeItem('selectedBoardType');

        // Navigate to invitation step
        setStep(5);
      } else if (error) {
        console.error('Error creating board:', error);
        alert('Failed to create board. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handlePublishBoard = async () => {
    if (!boardId) return;

    const { data, error } = await publishBoard(boardId);
    if (data && !error) {
      setStep(6);
    }
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
          <GlobalInput
            type="date"
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
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
          <GlobalInput
            type="tel"
            placeholder={field.placeholder || field.label}
            value={customFieldValues[field.field_key] || ''}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            width="100%"
            height="48px"
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
              <div className="text-center py-8">Loading...</div>
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
                      {fieldGroups.step1?.filter(f => f.field_key !== 'theme_color').map((field) => (
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
                    <div className="space-y-4">
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
                      <div className="flex justify-between mt-6">
                        <GlobalButton
                          title="Back"
                          onClick={() => setStep(step - 1)}
                          className="bg-gray-300 text-gray-700"
                          height="48px"
                          width="100px"
                          icon={ArrowLeft}
                        />
                        <GlobalButton
                          title="Next"
                          onClick={handleNextStep}
                          icon={ArrowRight}
                          height="48px"
                          width="120px"
                          className="flex-row-reverse"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Add Music and Media */}
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

                    {/* Media Upload Section */}
                    <div className="my-6">
                      <div onClick={() => setModalOpen(true)} className="border-2 hover:bg-gray-100 border-dashed cursor-pointer border-gray-300 rounded-lg p-8 text-center">
                        <Image src={AddWishImg} alt='' className='mx-auto' />
                        <p className="text-gray-500 mt-2">Upload memorable moments to share</p>
                      </div>
                    </div>

                    {/* Music Selection */}
                    <div className="space-y-4">
                      {fieldGroups.step3?.filter(f => f.field_key === 'music_track_id').map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium mb-2">
                            {field.label || "Background Music"}
                            {field.is_required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderField(field)}
                          {field.help_text && (
                            <p className="text-sm text-gray-500 mt-1">{field.help_text}</p>
                          )}
                        </div>
                      ))}

                      {/* Story Overlays if available */}
                      {fieldGroups.step3?.filter(f => f.field_key === 'story_overlays').map((field) => (
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
                    </div>

                    <div className="flex justify-between mt-6">
                      <GlobalButton
                        title="Back"
                        onClick={() => setStep(step - 1)}
                        className="bg-gray-300 text-gray-700"
                        height="48px"
                        width="100px"
                        icon={ArrowLeft}
                      />
                      <GlobalButton
                        title="Next"
                        icon={ArrowRight}
                        onClick={handleNextStep}
                        height="48px"
                        width="120px"
                        className="flex-row-reverse"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Privacy Settings */}
                {step === 4 && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-center text-[20px] max-[600px]:text-[16px] font-bold">Privacy Settings</h3>
                    <div className="space-y-4">
                      {fieldGroups.step4?.map((field) => (
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
                      ))}
                      <div className="flex justify-between mt-6">
                        <GlobalButton
                          title="Back"
                          onClick={() => setStep(step - 1)}
                          className="bg-gray-300 text-gray-700"
                          height="48px"
                          width="100px"
                          icon={ArrowLeft}
                        />
                        <GlobalButton
                          title={creating ? "Creating..." : "Create Board"}
                          onClick={handleCreateBoard}
                          disabled={creating}
                          height="48px"
                          width="160px"
                        />
                      </div>
                    </div>
                  </div>
                )}


                {/* Step 5: Who Can Join */}
                {step === 5 &&
                  <WhoCanJoin goToLiveBoard={handlePublishBoard} />
                }

                {/* Step 6: Board is Live */}
                {step === 6 &&
                  <YourBoardIsLive />
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
        <AddFilesModal doneOnclick={() => {
          setStep(3)
          setModalOpen(false)
        }}
          onClose={() => setModalOpen(false)}
        />
      </GlobalModal>
    </>
  );
};

export default CreateBirthdayBoard;
