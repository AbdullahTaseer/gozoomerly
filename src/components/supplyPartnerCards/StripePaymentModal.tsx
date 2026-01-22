'use client';

import {  useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  useStripe,
  useElements,
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCreateSubscription } from '../../hooks/useCreateSubscription';
import { SubscriptionPlan } from '../../types/subscriptionPlan';
import '../../styles/stripe.css';
import GlobalButton from '../buttons/GlobalButton';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '_');

interface PaymentFormProps {
  cancelClick: () => void;
  selectedPlan: SubscriptionPlan;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({ cancelClick, selectedPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createSubscription } = useCreateSubscription();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {

    const storedClientSecret = localStorage.getItem('clientSecret');
    const storedUserId = localStorage.getItem('userId');

    if (storedClientSecret) {
      setClientSecret(storedClientSecret);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
        letterSpacing: '0.025em',
        lineHeight: '24px',
      },
      invalid: {
        color: '#9e2146',
        iconColor: '#9e2146',
      },
    },
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    if (!clientSecret) {
      setError('Payment setup incomplete. Please complete registration first.');
      return;
    }

    if (!userId) {
      setError('User information not found. Please try again.');
      return;
    }

    if (!selectedPlan) {
      setError('No plan selected. Please select a plan.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter the cardholder name.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        throw new Error('Card information not found');
      }

      const { error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      const parsedUserId = parseInt(userId, 10);
      const planId = selectedPlan.plan_id;

      await createSubscription({
        userId: parsedUserId,
        planId: planId
      });

      localStorage.removeItem('clientSecret');

      toast.success('Payment successful! Redirecting...');

      router.push('/');

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Payment information not available. Please complete registration first.</p>
        <GlobalButton aos={false} onClick={cancelClick} title='Close' height='40px' width='80px' color="#012641" bgColor='white' borderColor='#012641' borderWidth='1px' className='mx-auto mt-4'/>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      {selectedPlan && (
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
          <p className="text-2xl font-bold text-[#FE7151]">${selectedPlan.price}</p>
          <p className="text-sm text-gray-600 mt-1">{selectedPlan.description}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <p className='pb-1 text-sm font-medium text-gray-700'>Cardholder Name *</p>
        <input
          type='text'
          placeholder='John Doe'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className='w-full outline-0 px-3 py-2.5 border bg-white border-gray-300 rounded-md focus:border-[#FE7151] focus:ring-1 focus:ring-[#FE7151] transition-colors'
        />
      </div>

      <div>
        <p className='pb-1 text-sm font-medium text-gray-700'>Card Number *</p>
        <div className="relative px-3 py-3 border bg-white border-gray-300 rounded-md focus-within:border-[#FE7151] focus-within:ring-1 focus-within:ring-[#FE7151] transition-colors">
          <CardNumberElement
            className="w-full"
            options={{
              ...cardElementOptions,
              placeholder: '1234 5678 9012 3456',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className='pb-1 text-sm font-medium text-gray-700'>Expiry Date *</p>
          <div className="relative px-3 py-3 border bg-white border-gray-300 rounded-md focus-within:border-[#FE7151] focus-within:ring-1 focus-within:ring-[#FE7151] transition-colors">
            <CardExpiryElement
              className="w-full"
              options={{
                ...cardElementOptions,
                placeholder: 'MM / YY',
              }}
            />
          </div>
        </div>
        <div>
          <p className='pb-1 text-sm font-medium text-gray-700'>CVC *</p>
          <div className="relative px-3 py-3 border bg-white border-gray-300 rounded-md focus-within:border-[#FE7151] focus-within:ring-1 focus-within:ring-[#FE7151] transition-colors">
            <CardCvcElement
              className="w-full"
              options={{
                ...cardElementOptions,
                placeholder: '123',
              }}
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>Your card information is secure and encrypted.</p>
      </div>

      <div className="flex flex-wrap justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={cancelClick}
          disabled={isProcessing}
          className="px-6 py-2 rounded-md font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing || !stripe}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${isProcessing || !stripe
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-[#FE7151] text-white hover:bg-[#e55a3c]'
            }`}
        >
          {isProcessing ? 'Processing...' : 'Submit Payment'}
        </button>
      </div>
    </form>
  );
};

interface StripePaymentModalProps {
  cancelClick: () => void;
  selectedPlan?: SubscriptionPlan;
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ cancelClick, selectedPlan }) => {
  if (!selectedPlan) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select a plan to continue.</p>
        <button
          onClick={cancelClick}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent cancelClick={cancelClick} selectedPlan={selectedPlan} />
    </Elements>
  );
};

export default StripePaymentModal;

