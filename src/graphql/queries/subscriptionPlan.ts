import { gql } from '@apollo/client';

export const GET_SUBSCRIPTION_PLANS = gql`
 query SubscriptionPlanList($countryid: Int, $global: Boolean, $isambassador: Boolean) {
  subscriptionPlanList(countryid: $countryid, global: $global, isambassador: $isambassador) {
    plan_id
    name
    price
    seats_limit
    customer_limit
    business_seats_limit
    total_seats_limit
    description
    monthly_fee
    per_user_joining_fee
    per_user_monthly_fee
    global
    isambassador
    countryid
    stripeplanid
    stripepriceid
    status
    created_at
    updated_at
    createdAt
    updatedAt
  }
}
`;

