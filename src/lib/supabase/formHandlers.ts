import { apolloClient } from '@/lib/apolloClient';
import { GET_FORM_HANDLERS_BY_PARTNER_ID, GET_FORM_HANDLER_BY_ID } from '@/graphql/queries/formHandler';
import { FormHandler } from '@/types/formHandler';

// Type definitions for GraphQL responses
interface GetFormHandlersByPartnerIdResponse {
  getFormHandlersByPartnerId: FormHandler[];
}

interface GetFormHandlerByIdResponse {
  getFormHandlerById: FormHandler;
}

/**
 * Fetches form handlers for a specific partner ID via GraphQL
 * @param partnerId - The partner ID to fetch form handlers for
 * @returns Array of form handlers or null if error
 */
export async function getFormHandlersByPartnerId(
  partnerId: number
): Promise<FormHandler[] | null> {
  try {
    const response = await apolloClient.query<GetFormHandlersByPartnerIdResponse>({
      query: GET_FORM_HANDLERS_BY_PARTNER_ID,
      variables: { partnerId }
    });

    if (response.data?.getFormHandlersByPartnerId) {
      return response.data.getFormHandlersByPartnerId;
    }

    return null;
  } catch (error) {
    console.error('Error fetching form handlers:', error);
    return null;
  }
}

/**
 * Fetches a single form handler by ID via GraphQL
 * @param id - The form handler ID
 * @returns Form handler or null if not found
 */
export async function getFormHandlerById(
  id: number
): Promise<FormHandler | null> {
  try {
    const response = await apolloClient.query<GetFormHandlerByIdResponse>({
      query: GET_FORM_HANDLER_BY_ID,
      variables: { id }
    });

    if (response.data?.getFormHandlerById) {
      return response.data.getFormHandlerById;
    }

    return null;
  } catch (error) {
    console.error('Error fetching form handler:', error);
    return null;
  }
}
