import {  useState  } from 'react';
import ArrowRightIcon from "@/assets/svgs/ArrowRight.svg";
import GlobalButton from '../buttons/GlobalButton';
import GlobalInput from '../inputs/GlobalInput';

type props = {
  continuePayment: () => void;
}

const ContinuePayment = ({ continuePayment }: props) => {

  const [selectedMethod, setSelectedMethod] = useState("card");
  const methods = [
    { id: "card", label: "Credit/Debit Card" },
    { id: "apple", label: "Apple Pay" },
    { id: "paypal", label: "PayPal" },
  ];

  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 max-[420px]:p-4 mx-auto space-y-6">
      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Complete Your Gift 💳
        </p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Securely send your gift using your preferred payment method.
        </p>
      </div>

      <div className='bg-[#0D0D0D] space-y-2 mt-4 p-4 rounded-md text-white'>
        <p className='!text-md'>Gift Summary</p>
        <p className='flex text-sm justify-between'>
          <span>Gift Amount:</span>
          <span>$50</span>
        </p>
        <p className='flex text-sm justify-between'>
          <span>Recipient:</span>
          <span>Sean Parker</span>
        </p>
        <div className='bg-[#353535] h-[1px] mt-3' />
        <div className=''>
          <p className='flex text-sm justify-between'>
            <span>Goal Progress</span>
            <span>3%</span>
          </p>
          <div className='bg-[#D9D9D9] h-1 rounded-full mt-2'>
            <div
              className="h-1 bg-[#F43C83] w-[3%] rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm text-black">
        <p>Payment Methods</p>
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`px-4 py-3 rounded-md border cursor-pointer transition ${selectedMethod === method.id
              ? "border-[#F13D84] bg-[#F9CEDF]"
              : "border-[#B2B2B2] hover:bg-gray-50"
              }`}
          >
            {method.label}
          </div>
        ))}
      </div>

      <div className='border p-4 border-[#B2B2B2] rounded-[8px] grid grid-cols-2 max-[420px]:grid-cols-1 gap-4'>
        <GlobalInput
          placeholder="1234 5678 9012 3456"
          title="Card Number"
          width="100%"
          height="40px"
          className="col-span-2 max-[420px]:col-span-1"
        />
        <GlobalInput
          placeholder="MM/YY"
          title="Expiration Date"
          width="100%"
          height="40px"
        />
        <GlobalInput
          placeholder="125"
          title="CVV"
          width="100%"
          height="40px"
        />
        <GlobalInput
          placeholder="Name on Card"
          title="Name on Card"
          width="100%"
          height="40px"
          className="col-span-2 max-[420px]:col-span-1"
        />
      </div>

      <GlobalButton
        title="Continue to Payment"
        icon={ArrowRightIcon}
        height="44px"
        className="mt-6 flex-row-reverse"
        onClick={continuePayment}
      />
    </div>
  );
};

export default ContinuePayment;