import { useState, useEffect } from 'react';
import { apolloClient } from '@/lib/apolloClient';
import { GET_FORM_HANDLERS_BY_PARTNER_ID } from '@/graphql/queries/formHandler';
import { FormHandler } from '@/types/formHandler';

interface GetFormHandlersByPartnerIdResponse {
  getFormHandlersByPartnerId: FormHandler[];
}

export const useFormHandlers = (partnerId: number | null) => {
  const [formHandlers, setFormHandlers] = useState<FormHandler[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFormHandlers = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apolloClient.query<GetFormHandlersByPartnerIdResponse>({
        query: GET_FORM_HANDLERS_BY_PARTNER_ID,
        variables: { partnerId: id }
      });

      if (response.data?.getFormHandlersByPartnerId) {
        setFormHandlers(response.data.getFormHandlersByPartnerId);
      } else {
        setError('Could not load form handlers from API.');
      }
    } catch {
      setError('An unexpected error occurred while loading form handlers.');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (partnerId) {
      fetchFormHandlers(partnerId);
    }
  }, [partnerId]);

  return {
    formHandlers,
    isLoading,
    error,
    refetch: fetchFormHandlers
  };
};
