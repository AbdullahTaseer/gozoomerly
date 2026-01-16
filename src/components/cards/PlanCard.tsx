'use client'

import React from 'react'
import GlobalButton from '../buttons/GlobalButton'

type Plan = {
  plan_id: number
  price: number
  name: string
  seats_limit?: number
  business_seats_limit?:number
  customer_limit?:number
  monthly_fee?: string
  per_user_joining_fee?: string
  per_user_monthly_fee?: string
  description?: string
}

type PlanCardProps = {
  plan: Plan
  isSelected: boolean
  onClick: () => void
  onSubscribe: () => void
}

const renderFeatureItem = (label: string) => (
  <li className="flex items-center gap-3 text-sm pl-4" key={label}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="12" fill="#2A313E" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.0965 7.39016L9.9365 14.3002L8.0365 12.2702C7.6865 11.9402 7.1365 11.9202 6.7365 12.2002C6.3465 12.4902 6.2365 13.0002 6.4765 13.4102L8.7265 17.0702C8.9465 17.4102 9.3265 17.6202 9.7565 17.6202C10.1665 17.6202 10.5565 17.4102 10.7765 17.0702C11.1365 16.6002 18.0065 8.41016 18.0065 8.41016C18.9065 7.49016 17.8165 6.68016 17.0965 7.38016V7.39016Z"
        fill="white"
      />
    </svg>
    <span className="text-[18px] max-[1023px]:text-[16px]">{label}</span>
  </li>
)

const PlanCard = ({ plan, isSelected, onClick, onSubscribe }: PlanCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl cursor-pointer max-[600px]:w-[320px] max-[350px]:w-[95%] w-full mx-auto shadow-sm text-[#1A1D26] p-[15px] border-2 transition-all duration-200 ${isSelected ? 'border-[#012641]' : 'border-gray-200'
        }`}
    >
      <h2 className="text-4xl font-bold text-center">${plan.price}</h2>
      <p className="text-center text-xl mt-2">{plan.name}</p>

      <ul className="mt-6 space-y-3">
        {plan.seats_limit && renderFeatureItem(`General User Seats Limit ${plan.seats_limit}`)}
        {plan.customer_limit && renderFeatureItem(`Customer Seats Limit ${plan.customer_limit}`)}
        {plan.business_seats_limit && renderFeatureItem(`Business Seats Limit ${plan.business_seats_limit}`)}
        {plan.monthly_fee && renderFeatureItem(`Monthly Fee ${plan.monthly_fee}`)}
        {plan.per_user_joining_fee && renderFeatureItem(`User Joining Fee ${plan.per_user_joining_fee}`)}
        {plan.per_user_monthly_fee && renderFeatureItem(`User Monthly Fee ${plan.per_user_monthly_fee}`)}
      </ul>

      {plan.description && (
        <div className="mt-6 border-t border-[#2E2C39] pt-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            {plan.description}
          </p>
        </div>
      )}

      {isSelected && (
        <GlobalButton
          aos={false}
          title="Subscribe"
          bgColor='black'
          width="100%"
          height="40px"
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation()
            onSubscribe()
          }}
        />
      )}
    </div>
  )
}

export default PlanCard