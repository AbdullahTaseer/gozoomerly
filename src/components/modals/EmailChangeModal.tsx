'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import { authService } from '@/lib/supabase/auth';

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSuccess: () => void;
}

 const EmailChangeForm = ({ currentEmail, onClose, onSuccess }: Omit<EmailChangeModalProps, 'isOpen'>) => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newEmail || !confirmEmail) {
      setError('Please fill in all fields');
      return;
    }

    if (newEmail !== confirmEmail) {
      setError('Emails do not match');
      return;
    }

    if (newEmail === currentEmail) {
      setError('New email cannot be the same as current email');
      return;
    }

    setLoading(true);
    const response = await authService.updateEmail(newEmail);
    setLoading(false);

    if (response.success) {
      alert(response.data?.message || 'Email update initiated. Please check your email.');
      onSuccess();
      onClose();
    } else {
      setError(response.error || 'Failed to update email');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4 shrink-0">
        <Mail size={28} className="text-black" strokeWidth={2} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Current email</p>
          <p className="font-medium">{currentEmail}</p>
        </div>

        <FloatingInput
          id="new-email"
          title="New Email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          width="100%"
        />

        <FloatingInput
          id="confirm-email"
          title="Confirm New Email"
          type="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          width="100%"
        />

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

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
            title={loading ? 'Updating...' : 'Update Email'}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default EmailChangeForm;