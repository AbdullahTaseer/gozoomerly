import React from 'react';
import ArrowRightIcon from "@/assets/svgs/ArrowRight.svg";
import GlobalButton from '../buttons/GlobalButton';

const ContinuePayment = () => {
  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 mx-auto space-y-6 max-w-xl">
      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Complete Your Gift 💳
        </p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Securely send your gift using your preferred payment method.
        </p>
      </div>

      <GlobalButton
        title="Continue to Payment"
        icon={ArrowRightIcon}
        height="44px"
        className="mt-6 flex-row-reverse"
      />
    </div>
  );
};

export default ContinuePayment;