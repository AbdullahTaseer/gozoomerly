import React from 'react';
import StripeImg from "@/assets/svgs/stripe.svg";
import TitleCard from '@/components/cards/TitleCard';
import PaypalCardImg from "@/assets/svgs/PayPal.svg";
import MasterCardImg from "@/assets/svgs/Mastercard.svg";
import GlobalButton from '@/components/buttons/GlobalButton';
import PaymentMethodCard from '@/components/cards/PaymentMethodCard';
import { Plus } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';

const PaymentMethod = () => {
  return (
    <>
      <DashNavbar hide={false} />
      <div className='px-[7%] max-[768px]:px-6 space-y-4'>
        <div className='flex items-center justify-between gap-3 max-[600px]:flex-col'>
          <TitleCard title='Select a payment method' className='text-left' />
          <GlobalButton title={'Add Payment Method'} width='180px' className='shrink-0' />
        </div>
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