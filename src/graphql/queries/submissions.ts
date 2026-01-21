import { gql } from '@apollo/client';

export const GET_ALL_SUBMISSIONS_BY_PARTNER_ID = gql`
  query GetAllSubmissionsByPartnerId($partnerId: ID!, $processed: Boolean) {
    getAllSubmissionsByPartnerId(partnerId: $partnerId, processed: $processed) {
      id
      form_id
      partner_id
      brand_id
      subdomain
      data
      processed
      submitted_at
      user_id
      stripe_customer_id
      stripe_client_secret
      user {
        user_id
        user_first_name
        email
        user_last_name
        user_type
        phone
        user_account_status
      }
      subscription {
        id
        user_id
        plan_id
        stripesubscriptionid
        status
        currentperiodstart
        currentperiodend
        createdAt
        updatedAt
        stripeplanid
        stripepriceid
        seats
        joining_fee_charged
        plan {
          plan_id
          name
          price
          seats_limit
          stripeplanid
          stripepriceid
          description
          monthly_fee
          per_user_joining_fee
          per_user_monthly_fee
        }
      }
    }
  }
`;
