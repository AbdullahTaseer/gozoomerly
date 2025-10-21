"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import AppLogo from "@/assets/svgs/Zoomerly.svg";
import Particles from "@/assets/svgs/why-people-love-particles.svg";

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

const CreateBirthdayBoard = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [boardId, setBoardId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedBoardType, setSelectedBoardType] = useState<{id: string, name: string, slug: string} | null>(null);
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
          <select
            value={customFieldValues[field.field_key] || ''}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Select {field.label}</option>
            {selectOptions.map((option: string) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={customFieldValues[field.field_key] || false}
              onChange={(e) => handleFieldChange(field.field_key, e.target.checked)}
              className="w-4 h-4"
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
          />
        );
      
      default:
        // Default to text input for unknown types
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
            {/* progress bar */}
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
                {/* Step 1: Tell us about the Birthday Star */}
                {step === 1 && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-center">Pick a theme and tell us about the Birthday star</h3>
                    
                    {/* Theme Color Selection */}
                    <div className="mb-8">
                      <div className="flex justify-center gap-4 flex-wrap">
                        {[
                          { name: 'Fun & Colorful', color: '#9B59B6', selected: true },
                          { name: 'Elegant & Gold', color: '#F1C40F' },
                          { name: 'Love', color: '#E91E63' },
                          { name: 'Love', color: '#5DADE2' },
                          { name: 'Kids', color: '#58D68D' },
                          { name: 'Success', color: '#76D7C4' },
                          { name: 'Travel', color: '#F8C471' }
                        ].map((theme, index) => (
                          <div key={index} className="text-center">
                            <div 
                              onClick={() => handleFieldChange('theme_color', theme.color)}
                              className={`w-16 h-16 rounded-full cursor-pointer transition-all ${
                                customFieldValues.theme_color === theme.color || (!customFieldValues.theme_color && theme.selected)
                                  ? 'ring-4 ring-offset-2 ring-gray-400' 
                                  : ''
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
                      <div className="flex justify-end mt-6">
                        <GlobalButton
                          title="Next"
                          onClick={handleNextStep}
                          height="48px"
                          width="120px"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Make a Wish Come True */}
                {step === 2 && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6">Make a Wish Come True</h3>
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
                        />
                        <GlobalButton
                          title="Next"
                          onClick={handleNextStep}
                          height="48px"
                          width="120px"
                        />
                      </div>
                    </div>
                  </div>
                )}
            
                {/* Step 3: Add Music and Media */}
                {step === 3 && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6">Add Music and Media</h3>
                    
                    {/* Media Upload Section */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4">Upload Photos and Videos</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <button 
                          onClick={() => setModalOpen(true)}
                          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Add Photos/Videos
                        </button>
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
                      />
                      <GlobalButton
                        title="Next"
                        onClick={handleNextStep}
                        height="48px"
                        width="120px"
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 4: Privacy Settings */}
                {step === 4 && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6">Privacy Settings</h3>
                    <div className="space-y-4">
                      {fieldGroups.step4?.map((field) => (
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
