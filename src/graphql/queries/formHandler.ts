import { gql } from '@apollo/client';

export const GET_FORM_HANDLERS_BY_PARTNER_ID = gql`
  query GetFormHandlersByPartnerId($partnerId: Int!) {
    getFormHandlersByPartnerId(partnerId: $partnerId) {
      id
      partner_id
      service_id
      brand_id
      service_url
      form_data
      created_at
      updated_at
    }
  }
`;

export const GET_FORM_HANDLER_BY_ID = gql`
  query GetFormHandlerById($id: Int!) {
    getFormHandlerById(id: $id) {
      id
      partner_id
      service_id
      brand_id
      service_url
      form_data
      created_at
      updated_at
    }
  }
`;
