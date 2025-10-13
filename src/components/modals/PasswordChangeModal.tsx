'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import { authService } from '@/lib/supabase/auth';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordChangeModal = ({ isOpen, onClose, onSuccess }: PasswordChangeModalProps) => {
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
      // Clear form
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(response.error || 'Failed to update password');
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

        <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              title={loading ? 'Updating...' : 'Update Password'}
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

export default PasswordChangeModal;