import { gql } from '@apollo/client';

export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($userId: Int!, $planId: Int!) {
    createSubscription(userId: $userId, planId: $planId) {
      subscription_id
      user_id
      plan_id
      stripe_subscription_id
      stripeplanid
      stripepriceid
      status
      joining_fee_charged
      current_period_start
      current_period_end
      createdAt
      updatedAt
    }
  }
`;

