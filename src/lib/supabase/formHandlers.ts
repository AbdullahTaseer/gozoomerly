import { apolloClient } from '@/lib/apolloClient';
import { GET_FORM_HANDLERS_BY_PARTNER_ID, GET_FORM_HANDLER_BY_ID } from '@/graphql/queries/formHandler';
import { FormHandler } from '@/types/formHandler';

interface GetFormHandlersByPartnerIdResponse {
  getFormHandlersByPartnerId: FormHandler[];
}

interface GetFormHandlerByIdResponse {
  getFormHandlerById: FormHandler;
}

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
  } catch {
    return null;
  }
}

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
  } catch {
    return null;
  }
}
