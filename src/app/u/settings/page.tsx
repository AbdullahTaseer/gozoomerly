'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Mail,
  LockKeyhole,
  Trash2,
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  UserLock,
} from 'lucide-react';
import MastercardImg from '@/assets/svgs/Mastercard.svg';
import PaymentMethodCard from '@/components/cards/PaymentMethodCard';
import { authService } from '@/lib/supabase/auth';
import { useRouter } from 'next/navigation';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import BellIconIndicator from '@/components/cards/BellIconIndicator';
import ModalOrBottomSlider from '@/components/modals/ModalOrBottomSlider';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import EmailChangeForm from '@/components/modals/EmailChangeModal';
import PasswordChangeForm from '@/components/modals/PasswordChangeModal';

const Settings = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getUser();
      if (!currentUser) {
        router.push('/signin');
        return;
      }
      setUser(currentUser);
    } catch {
      router.push('/signin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    router.push('/signin');
  };

  if (loading) {
    return (
      <>
        <DashNavbar />
        <MobileHeader
          title="Settings"
          showBack={true}
          onBackClick={() => router.push('/u/profile')}
          profileRight={true}
        />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
        </div>
      </>
    );
  }

  return (
    <div className='text-black'>
      <DashNavbar />
      <MobileHeader
        title="Settings"
        showBack={true}
        onBackClick={() => router.push('/u/profile')}
        profileRight={true}
      />

      <div className="max-[769px]:hidden flex justify-between items-center px-[7%] py-4">
        <button onClick={() => router.push('/u/profile')} className="flex items-center gap-2 text-black">
          <ArrowLeft size={24} />
          <span className="text-3xl font-bold">Settings</span>
        </button>
        <BellIconIndicator />
      </div>

      <div className="px-[7%] max-[769px]:px-6 pb-8">
        <section className="py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-black mb-3">Account Settings</h3>
          <button
            onClick={() => setShowEmailModal(true)}
            className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail size={20} className="" />
              <span className="">Email</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <LockKeyhole size={20} className="" />
              <span className="">Password reset</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </section>

        <section className="py-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold ">Payment Method</h3>
            <Link href="/u/paymentMethod" className="text-sm text-gray-500 hover:text-pink-500">
              Change
            </Link>
          </div>
          <PaymentMethodCard
            showRadio={false}
            cardImg={MastercardImg}
            cardName="Mastercard"
            cardNumber="*** *5930"
          />
        </section>

        <section className="py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold  mb-3">Payment History</h3>
          <Link
            href="/u/paid"
            className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <ArrowUpRight size={20} className="text-red-500 shrink-0" />
              <span className="">Paid</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </Link>
          <Link
            href="/u/received"
            className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <ArrowDownRight size={20} className="text-green-500 shrink-0" />
              <span className="">Received</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </Link>
        </section>

        <section className="py-4">
          <button
            className="w-full flex items-center gap-3 py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setDeleteAccountModal(true)}
          >
            <Trash2 size={20} className="text-red-500" />
            <span className="text-red-500">Delete Account</span>
          </button>
          <button
            onClick={() => setLogoutModal(true)}
            className="w-full flex items-center gap-3 py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <UserLock size={20} className="" />
            <span className="">Log out</span>
          </button>
        </section>
      </div>

      <ModalOrBottomSlider
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Change Email"
        desktopClassName="max-w-[400px]"
      >
        <EmailChangeForm
          currentEmail={user?.email || ''}
          onClose={() => setShowEmailModal(false)}
          onSuccess={fetchUser}
        />
      </ModalOrBottomSlider>

      <ModalOrBottomSlider
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        desktopClassName="max-w-[400px]"
      >
        <PasswordChangeForm onClose={() => setShowPasswordModal(false)} onSuccess={() => { }} />
      </ModalOrBottomSlider>

      <ConfirmationModal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        title="Log out"
        icon={UserLock}
        message="Are you sure you want to log out? You’ll need to sign in again to access your nutrition plan."
        primaryLabel="Yes"
        onPrimaryClick={handleLogout}
      />

      <ConfirmationModal
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        title="Delete Account"
        icon={Trash2}
        message="This action is permanent and cannot be undone. All your data and plans will be deleted. Are you sure you want to continue?"
        primaryLabel="Yes, Delete My Account"
        onPrimaryClick={() => {
          setDeleteAccountModal(false);
          // TODO: Implement delete account
        }}
      />
    </div>
  );
};

export default Settings;
