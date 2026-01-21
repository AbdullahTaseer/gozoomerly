import { useState, useCallback } from 'react';
import { apolloClient } from '../lib/apolloClient';
import { GET_ALL_SUBMISSIONS_BY_PARTNER_ID } from '../graphql/queries/submissions';

export interface SubmissionUser {
  user_id: string;
  user_first_name: string;
  email: string;
  user_last_name: string;
  user_type: string;
  phone: string;
  user_account_status: string;
}

export interface SubscriptionPlan {
  plan_id: string;
  name: string;
  price: number;
  seats_limit: number;
  stripeplanid: string;
  stripepriceid: string;
  description: string;
  monthly_fee: number;
  per_user_joining_fee: number;
  per_user_monthly_fee: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripesubscriptionid: string;
  status: string;
  currentperiodstart: string;
  currentperiodend: string;
  createdAt: string;
  updatedAt: string;
  stripeplanid: string;
  stripepriceid: string;
  seats: number;
  joining_fee_charged: boolean;
  plan: SubscriptionPlan;
}

export interface Submission {
  id: string;
  form_id: string;
  partner_id: string;
  brand_id: string;
  subdomain: string;
  data: any;
  processed: boolean;
  submitted_at: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_client_secret: string;
  user: SubmissionUser;
  subscription: Subscription;
}

interface GetAllSubmissionsResponse {
  getAllSubmissionsByPartnerId: Submission[];
}

interface GetAllSubmissionsVariables {
  partnerId: number;
  processed?: boolean;
}

export const useGetSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async (partnerId: number, processed?: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apolloClient.query<GetAllSubmissionsResponse, GetAllSubmissionsVariables>({
        query: GET_ALL_SUBMISSIONS_BY_PARTNER_ID,
        variables: {
          partnerId,
          processed
        }
      });

      if (response.data?.getAllSubmissionsByPartnerId) {
        setSubmissions(response.data.getAllSubmissionsByPartnerId);
        return response.data.getAllSubmissionsByPartnerId;
      }
      return [];
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Could not load submissions. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    submissions,
    isLoading,
    error,
    fetchSubmissions
  };
};
