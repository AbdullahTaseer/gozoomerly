import { useState } from 'react';
import { apolloClient } from '@/lib/apolloClient';
import { SUBMIT_FORM, PROCESS_SUBMISSION } from '@/graphql/mutations/formHandler';
import { FormDataRecord, UploadFile } from '@/types/formHandler';

interface SubmitFormParams {
  formId: number;
  brandId: number;
  data: FormDataRecord;
  file?: UploadFile | null;
}

interface ProcessSubmissionParams {
  submissionId: number;
  brandId: number;
}

interface SubmitFormResult {
  id: number;
  form_id: number;
  partner_id: number;
  brand_id: number;
  data: FormDataRecord;
  processed: boolean;
  submitted_at: string;
  user_id: number | null;
  stripe_customer_id: string | null;
  stripe_client_secret: string | null;
  brand?: {
    id: number;
    name: string;
    description: string;
    image: string;
    category_id: number;
    domain_url: string;
    status: string;
  };
  subscription?: {
    id: number;
    user_id: number;
    plan_id: number;
    stripesubscriptionid: string;
    status: string;
    currentperiodstart: string;
    currentperiodend: string;
    plan: {
      plan_id: number;
      name: string;
      price: number;
      description: string;
    };
  };
  user?: {
    user_id: number;
    user_first_name: string;
    email: string;
    user_last_name: string;
    user_type: string;
    phone: string;
    user_account_status: string;
  };
}

interface SubmitFormResponse {
  submitForm: SubmitFormResult;
}

interface ProcessSubmissionResponse {
  processSubmission: SubmitFormResult;
}

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (params: SubmitFormParams) => {
    try {
      const result = await apolloClient.mutate<SubmitFormResponse>({
        mutation: SUBMIT_FORM,
        variables: {
          formId: params.formId,
          brandId: params.brandId,
          data: params.data,
          file: params.file || null
        }
      });

      return result.data?.submitForm;
    } catch (err) {
      throw err;
    }
  };

  const processSubmission = async (params: ProcessSubmissionParams) => {
    try {
      const result = await apolloClient.mutate<ProcessSubmissionResponse>({
        mutation: PROCESS_SUBMISSION,
        variables: {
          submissionId: params.submissionId,
          brandId: params.brandId
        }
      });

      return result.data?.processSubmission;
    } catch (err) {
      throw err;
    }
  };

  const submitAndProcessForm = async (params: SubmitFormParams) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const submitResult = await submitForm(params);

      if (submitResult?.id) {
        const submissionId = submitResult.id;
        const submissionBrandId = submitResult.brand_id;

        if (submitResult.stripe_client_secret) {
          localStorage.setItem('clientSecret', submitResult.stripe_client_secret);
        }
        if (submitResult.user_id) {
          localStorage.setItem('userId', submitResult.user_id.toString());
        }

        try {
          const processResult = await processSubmission({
            submissionId: submissionId,
            brandId: submissionBrandId
          });

          if (processResult?.stripe_client_secret) {
            localStorage.setItem('clientSecret', processResult.stripe_client_secret);
          }
          if (processResult?.user_id) {
            localStorage.setItem('userId', processResult.user_id.toString());
          }

          return { submitResult, processResult };
        } catch (processError) {
          return { submitResult, processResult: null };
        }
      } else {
        throw new Error('Form submission failed - no ID returned');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error submitting form';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    processSubmission,
    submitAndProcessForm,
    isSubmitting,
    error
  };
};
