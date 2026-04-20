'use client'

import {  useState  } from 'react';

import StripePaymentModal from '@/components/supplyPartnerCards/StripePaymentModal';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import GlobalModal from '@/components/modals/GlobalModal';
import PlanCard from '@/components/cards/PlanCard';
import { SkeletonPlanCard } from '@/components/skeletons';

const Subscriptionplan = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [modalOpen, setIsOpen] = useState(false)

  const { plans, isLoading, error } = useSubscriptionPlans({
    global: true,
    isambassador: false
  });

  if (error) {
    return (
      <div className="py-4 px-[5%] max-[768px]:px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-4 px-[5%] max-[768px]:px-4">
        <p className="font-bold text-3xl">Unlock Passive Income</p>
        <p>Choose a plan that suits you and start earning passive income.</p>

        {isLoading ? (
          <div className="grid grid-cols-3 max-[950px]:grid-cols-2 max-[600px]:grid-cols-1 gap-6 mx-auto mt-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonPlanCard key={i} />
            ))}
          </div>
        ) : (
          plans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No subscription plans available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 max-[950px]:grid-cols-2 max-[600px]:grid-cols-1 gap-6 mx-auto mt-10">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.plan_id}
                  plan={{
                    ...plan,
                    monthly_fee: `$${plan.monthly_fee}`,
                    per_user_joining_fee: `$${plan.per_user_joining_fee}`,
                    per_user_monthly_fee: `$${plan.per_user_monthly_fee}`
                  }}
                  isSelected={selectedPlanId === plan.plan_id}
                  onClick={() => setSelectedPlanId(plan.plan_id)}
                  onSubscribe={() => setIsOpen(true)}
                />
              ))}
            </div>
          ))}
      </div>

      <GlobalModal
        isOpen={modalOpen}
        onClose={() => setIsOpen(false)}
        title="Commitment & Onboarding Fees"
        className='w-[500px] max-[550px]:w-[90vw]'
      >
        <StripePaymentModal
          cancelClick={() => setIsOpen(false)}
          selectedPlan={plans.find(plan => plan.plan_id === selectedPlanId)}
        />
      </GlobalModal>
    </>
  )
}

export default Subscriptionplan