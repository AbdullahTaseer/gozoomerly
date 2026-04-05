'use client';
import StripeImg from "@/assets/svgs/stripe.svg";
import PaypalCardImg from "@/assets/svgs/PayPal.svg";
import MasterCardImg from "@/assets/svgs/Mastercard.svg";
import PaymentMethodCard from '@/components/cards/PaymentMethodCard';
import { Plus } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from "@/components/navbar/MobileHeader";
import { useRouter } from "next/navigation";

const PaymentMethod = () => {
  const router = useRouter();
  return (
    <>
      <DashNavbar />
      <MobileHeader
        title="Select a payment method"
        titleColor="!text-lg"
        showBack={true}
        onBackClick={() => router.push('/u/profile')}
        profileRight={true}
      />
      <div className='px-[7%] max-[768px]:px-6 space-y-4 mt-6'>
        <p className="text-3xl pb-6 font-bold max-[769px]:hidden">Select a payment method</p>
        <PaymentMethodCard cardImg={MasterCardImg} cardName={'Mastercard'} cardNumber={'**** 5930'} />
        <PaymentMethodCard cardImg={PaypalCardImg} cardName={'Paypal'} cardNumber={'**** 5930'} />
        <PaymentMethodCard cardImg={StripeImg} cardName={'Stripe'} cardNumber={'**** 5930'} />
        <div className='inline-flex cursor-pointer items-center gap-3'>
          <Plus size={18} /> Add a payment method
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;