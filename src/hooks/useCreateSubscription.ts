import { useState } from 'react';
import { apolloClient } from '../lib/apolloClient';
import { CREATE_SUBSCRIPTION } from '../graphql/mutations/subscription';

interface CreateSubscriptionParams {
  userId: number;
  planId: number;
}

export const useCreateSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubscription = async (params: CreateSubscriptionParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apolloClient.mutate({
        mutation: CREATE_SUBSCRIPTION,
        variables: {
          userId: params.userId,
          planId: params.planId
        }
      });

      return result.data?.createSubscription;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSubscription,
    isLoading,
    error
  };
};

