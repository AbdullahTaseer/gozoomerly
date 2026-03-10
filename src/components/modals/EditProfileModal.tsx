"use client";

import {  useEffect, useState  } from 'react';
import ModalOrBottomSlider from './ModalOrBottomSlider';
import FloatingInput from '@/components/inputs/FloatingInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/supabase/auth';

type UserProfile = {
  id: string;
  name?: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  bio?: string | null;
  work?: string | null;
  profile_pic_url?: string | null;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSuccess?: (updatedProfile: any) => void;
}

const EditProfileModal: React.FC<Props> = ({ isOpen, onClose, profile, onSuccess }) => {
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
        bio: profile.bio || '',
        work: profile.work || '',
      });
    } else {
      setForm({});
    }
  }, [profile, isOpen]);

  const handleChange = (key: keyof UserProfile, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!profile) {
      setError('Profile not loaded');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      const payload: any = {
        name: form.name || null,
        country: form.country || null,
        state: form.state || null,
        city: form.city || null,
        bio: form.bio || null,
        work: form.work || null,
      };

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', profile.id)
        .select()
        .single();

      if (updateError) {
        setError(updateError.message || 'Failed to update profile');
        setLoading(false);
        return;
      }

      const { error: authErr } = await authService.updateUserProfile({
        full_name: form.name,
        bio: form.bio,
        work: form.work,
        country: form.country,
        state: form.state,
        city: form.city,
      });

      if (authErr) {
      }

      setLoading(false);
      onSuccess && onSuccess(updatedProfile);
      onClose();
    } catch (err) {
      setError('Unexpected error while saving profile');
      setLoading(false);
    }
  };

  return (
    <ModalOrBottomSlider desktopClassName='w-[500px]' isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingInput
          id="edit-name"
          title="Full name"
          type="text"
          value={form.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          width="100%"
        />

        <FloatingInput
          id="edit-country"
          title="Country"
          type="text"
          value={form.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
          width="100%"
        />

        <FloatingInput
          id="edit-state"
          title="State"
          type="text"
          value={form.state || ''}
          onChange={(e) => handleChange('state', e.target.value)}
          width="100%"
        />

        <FloatingInput
          id="edit-city"
          title="City"
          type="text"
          value={form.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          width="100%"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={form.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full bg-white/10 text-gray-900 border-[#2E2C39] px-3 py-2 rounded-md border outline-0 min-h-[120px]"
            maxLength={1000}
          />
        </div>

        <FloatingInput
          id="edit-work"
          title="Work / Company"
          type="text"
          value={form.work || ''}
          onChange={(e) => handleChange('work', e.target.value)}
          width="100%"
        />

        {error && (
          <div className="p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-full"
            disabled={loading}
          >
            Cancel
          </button>
          <GlobalButton height='46px' width='150px' title={loading ? 'Saving...' : 'Save Changes'} onClick={handleSubmit} disabled={loading} />
        </div>
      </form>
    </ModalOrBottomSlider>
  );
};

export default EditProfileModal;
