'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import { authService } from '@/lib/supabase/auth';

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSuccess: () => void;
}

const EmailChangeModal = ({ isOpen, onClose, currentEmail, onSuccess }: EmailChangeModalProps) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Change Email</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <GlobalButton
              title={loading ? 'Updating...' : 'Update Email'}
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailChangeModal;