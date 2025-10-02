import React from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type props = {
  cardImg: string | StaticImport;
  cardName: string;
  cardNumber: string;
  showRadio?: boolean;
  name?: string;
}

const PaymentMethodCard = ({ cardImg, cardName, cardNumber, showRadio = true, name = "paymentMethod" }: props) => {
  return (
    <div className='flex justify-between'>
      <div className='flex items-center gap-4'>
        <Image src={cardImg} height={30} width={30} className='border rounded p-1' alt={cardName} />
        <div>
          <p className='font-medium'>{cardName}</p>
          <p className='text-xs'>{cardNumber}</p>
        </div>
      </div>
      {showRadio &&
        <input
          type='radio'
          name={name}
          className='h-4 w-4 accent-black'
        />
      }
    </div>
  );
};

export default PaymentMethodCard;
