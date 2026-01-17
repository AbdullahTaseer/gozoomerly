import { useState, useEffect } from 'react';
import { apolloClient } from '../lib/apolloClient';
import { GET_SUBSCRIPTION_PLANS } from '../graphql/queries/subscriptionPlan';
import { 
  SubscriptionPlan, 
  SubscriptionPlanListResponse, 
  SubscriptionPlanListVariables 
} from '../types/subscriptionPlan';

interface UseSubscriptionPlansParams {
  global?: boolean;
  isambassador?: boolean;
}

export const useSubscriptionPlans = (params: UseSubscriptionPlansParams = {}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apolloClient.query<SubscriptionPlanListResponse, SubscriptionPlanListVariables>({
        query: GET_SUBSCRIPTION_PLANS,
        variables: {
          global: params.global ?? true,
          isambassador: params.isambassador ?? false
        }
      });

      if (response.data?.subscriptionPlanList) {
        setPlans(response.data.subscriptionPlanList);
      }
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setError('Could not load subscription plans. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [params.global, params.isambassador]);

  return {
    plans,
    isLoading,
    error,
    refetch: fetchPlans
  };
};

