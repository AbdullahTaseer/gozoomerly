'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormHandlers } from '@/hooks/use-form-handlers';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { FormField, FieldValue, FormDataRecord } from '@/types/formHandler';
import { ArrowLeft } from 'lucide-react';

interface PartnerRegistrationFormProps {
  partnerId: number;
  onBack?: () => void;
  initialValues?: {
    email?: string;
    name?: string;
    phone?: string;
    referralCode?: string;
  };
}

export const PartnerRegistrationForm: React.FC<PartnerRegistrationFormProps> = ({ 
  partnerId,
  onBack, 
  initialValues 
}) => {
  const router = useRouter();
  const { formHandlers, isLoading, error } = useFormHandlers(partnerId);
  const { submitAndProcessForm, isSubmitting, error: submitError } = useFormSubmission();
  const [formData, setFormData] = useState<FormDataRecord>({});
  const [parsedFields, setParsedFields] = useState<FormField[]>([]);

  const mapUrlParamToFieldName = (fieldName: string): string[] => {
    const nameLower = fieldName.toLowerCase();

    if (nameLower.includes('email')) return ['email'];
    if (nameLower.includes('name') && !nameLower.includes('username')) {
      if (nameLower.includes('first')) return ['firstName', 'first_name'];
      if (nameLower.includes('last')) return ['lastName', 'last_name'];
      if (nameLower.includes('full')) return ['fullName', 'full_name'];
      return ['name'];
    }
    if (nameLower.includes('phone') || nameLower.includes('mobile') || nameLower.includes('tel')) {
      return ['phone', 'phoneNumber', 'phone_number', 'mobile', 'telephone'];
    }
    if (nameLower.includes('invite') || nameLower.includes('referral') || nameLower.includes('code')) {
      return ['inviteCode', 'invite_code', 'referralCode', 'referral_code', 'code'];
    }

    return [];
  };

  const normalizeFormElements = (elements: FormField[]): FormField[] => {
    return elements.map((element, index) => ({
      id: element.id || `element_${index}`,
      type: element.type || 'text',
      label: element.label || element.name || `Field ${index + 1}`,
      name: element.name,
      placeholder: element.placeholder || '',
      required: element.required || false,
      value: element.value || '',
      options: element.options || [],
      validation: element.validation || {},
      style: element.style || {},
      isSystemField: element.isSystemField || false,
      showOnlyInPreview: element.showOnlyInPreview || false
    }));
  };

  useEffect(() => {
    setFormData({});
    setParsedFields([]);

    if (formHandlers && formHandlers.length > 0) {
      const firstHandler = formHandlers[0];

      if (Array.isArray(firstHandler.form_data)) {
        const normalizedFields = normalizeFormElements(firstHandler.form_data);
        setParsedFields(normalizedFields);

        const initialData: FormDataRecord = {};
        normalizedFields.forEach((field: FormField) => {
          initialData[field.id] = field.value || '';

          if (initialValues) {
            const fieldName = field.name || field.label || '';

            if (mapUrlParamToFieldName(fieldName).includes('email') && initialValues.email) {
              initialData[field.id] = initialValues.email;
            } else if (mapUrlParamToFieldName(fieldName).includes('name') && initialValues.name) {
              initialData[field.id] = initialValues.name;
            } else if (mapUrlParamToFieldName(fieldName).some(name =>
              ['phone', 'phoneNumber', 'phone_number', 'mobile', 'telephone'].includes(name)
            ) && initialValues.phone) {
              initialData[field.id] = initialValues.phone;
            } else if (mapUrlParamToFieldName(fieldName).some(name =>
              ['inviteCode', 'invite_code', 'referralCode', 'referral_code', 'code'].includes(name)
            ) && initialValues.referralCode) {
              initialData[field.id] = initialValues.referralCode;
            }
          }
        });
        setFormData(initialData);
      }
    }
  }, [formHandlers, initialValues]);

  const handleInputChange = (fieldId: string, value: FieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const capitalizeFieldName = (name: string): string => {
    return name
      .replace(/\s+/g, '_')  // Replace spaces with underscores
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('_');
  };

  const getFieldNameForSubmission = (field: FormField): string => {
    const fieldName = field.name || field.label || '';
    const nameLower = fieldName.toLowerCase();
    
    let standardName: string;

    // Map common field types to standard names
    if (nameLower.includes('password')) {
      standardName = 'Password';
    } else if (nameLower.includes('email')) {
      standardName = 'Email';
    } else if (nameLower.includes('phone') || nameLower.includes('mobile') || nameLower.includes('tel')) {
      standardName = 'Phone';
    } else if (nameLower.includes('name') && !nameLower.includes('username')) {
      // For name fields, use the actual field name
      standardName = capitalizeFieldName(fieldName);
    } else {
      // For all other fields (including invite/referral codes), use the actual field name
      standardName = capitalizeFieldName(fieldName);
    }

    // Clean up field ID - remove "invite_code_" prefix if it exists
    let cleanFieldId = field.id.toString();
    if (cleanFieldId.startsWith('invite_code_')) {
      cleanFieldId = cleanFieldId.replace('invite_code_', '');
    }

    // Return format: {field_id}_{Field_Name}
    return `${cleanFieldId}_${standardName}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formHandlers || formHandlers.length === 0) {
      return;
    }

    try {
      const formHandler = formHandlers[0];
      
      // Transform formData to use field names instead of IDs
      const transformedData: FormDataRecord = {};
      let inviteCodeField: FormField | null = null;
      
      parsedFields.forEach((field) => {
        const fieldName = field.name || field.label || '';
        const nameLower = fieldName.toLowerCase();
        
        // Find invite code field but don't add it yet - we'll send empty string
        if (nameLower.includes('invite') || nameLower.includes('referral') || nameLower.includes('code')) {
          inviteCodeField = field;
          return; // Skip adding this field to transformedData
        }
        
        const fieldKey = getFieldNameForSubmission(field);
        const fieldValue = formData[field.id];
        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
          transformedData[fieldKey] = fieldValue;
        }
      });
      
      // Send empty string for invite code using the invite code field's format
      if (inviteCodeField) {
        const inviteCodeKey = getFieldNameForSubmission(inviteCodeField);
        transformedData[inviteCodeKey] = '';
      }

      // Prepare submission payload
      const submissionPayload = {
        formId: formHandler.id,
        brandId: formHandler.brand_id,
        data: transformedData,
        file: null
      };

      const result = await submitAndProcessForm(submissionPayload);

      if (result?.submitResult) {
        // Check if user needs to complete payment
        if (result.submitResult.stripe_client_secret) {
          // Redirect to payment page if needed
          router.push('/payment');
        } else {
          // Redirect to thank you page
          router.push('/thankYou');
        }
      }
    } catch {
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E3418B]"></div>
        <span className="ml-2 text-gray-600">Loading form...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">Error loading form:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!formHandlers || formHandlers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No registration form available.
      </div>
    );
  }

  const renderField = (field: FormField) => {
    const fieldId = field.id;
    const rawValue = formData[fieldId];
    const fieldValue = rawValue === null || rawValue === undefined
      ? ''
      : typeof rawValue === 'boolean'
        ? rawValue.toString()
        : rawValue instanceof Date
          ? rawValue.toISOString().split('T')[0]
          : String(rawValue);
    const fieldLabel = field.label;
    const fieldPlaceholder = field.placeholder || '';
    const fieldType = field.type || 'text';

    const isChecked = rawValue === true || fieldValue === 'true';

    switch (fieldType) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
      case 'number':
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldLabel} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={fieldType}
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              placeholder={fieldPlaceholder}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder:text-sm focus:outline-none focus:ring-[#E3418B] focus:border-[#E3418B]"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldLabel} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              placeholder={fieldPlaceholder}
              required={field.required}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E3418B] focus:border-[#E3418B]"
            />
          </div>
        );

      case 'select':
      case 'dropdown':
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldLabel} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E3418B] focus:border-[#E3418B]"
            >
              <option value="">Select {fieldLabel}</option>
              {field.options?.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : String(option.value || '');
                const optionLabel = typeof option === 'string' ? option : String(option.label || optionValue);
                return (
                  <option key={index} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleInputChange(fieldId, e.target.checked)}
                className="h-4 w-4 text-[#E3418B] focus:ring-[#E3418B] border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {fieldLabel} {field.required && <span className="text-red-500">*</span>}
              </span>
            </label>
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {fieldLabel} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : String(option.value || '');
                const optionLabel = typeof option === 'string' ? option : String(option.label || optionValue);
                return (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={fieldId}
                      value={optionValue}
                      checked={fieldValue === optionValue}
                      onChange={(e) => handleInputChange(fieldId, e.target.value)}
                      className="h-4 w-4 text-[#E3418B] focus:ring-[#E3418B] border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {optionLabel}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      default:
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldLabel} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              placeholder={fieldPlaceholder}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 placeholder:text-sm rounded-md shadow-sm focus:outline-none focus:ring-[#E3418B] focus:border-[#E3418B]"
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-[500px] w-full mx-auto">
      <div className="flex items-center gap-2 justify-between mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm h-10 w-10 hover:bg-gray-200 rounded-full justify-center items-center cursor-pointer flex gap-2 text-black"
          >
            <ArrowLeft className='w-5 h-5 shrink-0' />
          </button>
        )}
        <h3 className="text-xl font-bold text-gray-900">
          Registration Form
        </h3>
        <div />
      </div>

      {parsedFields.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {parsedFields
            .filter(field => {
              // Hide invite code fields
              const fieldName = field.name || field.label || '';
              const nameLower = fieldName.toLowerCase();
              return !(nameLower.includes('invite') || nameLower.includes('referral') || nameLower.includes('code'));
            })
            .map(field => renderField(field))}

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submitError}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-md focus:outline-none cursor-pointer text-sm transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#E3418B] text-white hover:bg-[#d13178]'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-500">No form fields available.</p>
      )}
    </div>
  );
};
