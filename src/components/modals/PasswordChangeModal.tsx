'use client';

import { useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import { authService } from '@/lib/supabase/auth';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordChangeForm = ({ onClose, onSuccess }: Omit<PasswordChangeModalProps, 'isOpen'>) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const response = await authService.updatePassword(newPassword);
    setLoading(false);

    if (response.success) {
      alert(response.data?.message || 'Password updated successfully');
      onSuccess();
      onClose();

      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(response.error || 'Failed to update password');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4 shrink-0">
        <LockKeyhole size={28} className="text-black" strokeWidth={2} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <FloatingInput
          id="new-password"
          title="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          width="100%"
        />

        <FloatingInput
          id="confirm-password"
          title="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          width="100%"
        />

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-600">
          Password must be at least 6 characters long
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-full hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <GlobalButton
            title={loading ? 'Updating...' : 'Update Password'}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;