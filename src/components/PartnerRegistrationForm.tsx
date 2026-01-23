'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormHandlers } from '@/hooks/use-form-handlers';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { FormField, FieldValue, FormDataRecord } from '@/types/formHandler';
import { Eye, EyeOff } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import FloatingSelect from '@/components/inputs/FloatingSelect';
import GlobalButton from '@/components/buttons/GlobalButton';
import { SelectItem } from '@/components/ui/select';
import { Country, State, City } from 'country-state-city';

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
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [countryCode, setCountryCode] = useState<string>('');
  const [stateCode, setStateCode] = useState<string>('');

  const countries = Country.getAllCountries();
  const states = countryCode ? State.getStatesOfCountry(countryCode) : [];
  const cities = countryCode && stateCode ? City.getCitiesOfState(countryCode, stateCode) : [];


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
          const fieldName = (field.name || field.label || '').toLowerCase();

          if (initialValues) {
            if (mapUrlParamToFieldName(field.name || field.label || '').includes('email') && initialValues.email) {
              initialData[field.id] = initialValues.email;
            } else if (mapUrlParamToFieldName(field.name || field.label || '').includes('name') && initialValues.name) {
              initialData[field.id] = initialValues.name;
            } else if (mapUrlParamToFieldName(field.name || field.label || '').some(name =>
              ['phone', 'phoneNumber', 'phone_number', 'mobile', 'telephone'].includes(name)
            ) && initialValues.phone) {
              initialData[field.id] = initialValues.phone;
            }
          }

        });
        setFormData(initialData);

        normalizedFields.forEach((field: FormField) => {
          const fieldName = (field.name || field.label || '').toLowerCase();
          const fieldValue = initialData[field.id];
          
          if (fieldName.includes('country') && fieldValue) {
            const countryName = String(fieldValue);
            const country = countries.find(c => c.name === countryName);
            if (country) {
              setCountryCode(country.isoCode);
            }
          }
        });
      }
    }
  }, [formHandlers, initialValues]);

  useEffect(() => {
    if (countryCode) {
      const currentStates = State.getStatesOfCountry(countryCode);
      parsedFields.forEach((field: FormField) => {
        const fieldName = (field.name || field.label || '').toLowerCase();
        const fieldValue = formData[field.id];
        
        if (fieldName.includes('state') && fieldValue) {
          const stateName = String(fieldValue);
          const state = currentStates.find(s => s.name === stateName);
          if (state) {
            setStateCode(state.isoCode);
          }
        }
      });
    }
  }, [countryCode, parsedFields, formData]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one capital letter';
    }
    return null;
  };

  const handleInputChange = (fieldId: string, value: FieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    if (fieldErrors[fieldId]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = (fieldId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
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

    const passwordFields = parsedFields.filter(field => {
      const fieldName = (field.name || field.label || '').toLowerCase();
      return fieldName.includes('password') && field.type === 'password';
    });

    const passwordErrors: Record<string, string> = {};
    let hasPasswordErrors = false;

    passwordFields.forEach(field => {
      const fieldId = field.id;
      const passwordValue = String(formData[fieldId] || '');
      const error = validatePassword(passwordValue);
      if (error) {
        passwordErrors[fieldId] = error;
        hasPasswordErrors = true;
      }
    });

    if (hasPasswordErrors) {
      setFieldErrors(prev => ({ ...prev, ...passwordErrors }));
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
        
        if (nameLower.includes('invite') || nameLower.includes('referral') || nameLower.includes('code')) {
          inviteCodeField = field;
          return;
        }
        
        const fieldKey = getFieldNameForSubmission(field);
        let fieldValue = formData[field.id];
        
        if (nameLower.includes('country') && countryCode) {
          const selectedCountry = countries.find(c => c.isoCode === countryCode);
          fieldValue = selectedCountry?.name || countryCode;
        } else if (nameLower.includes('state') && stateCode) {
          const selectedState = states.find(s => s.isoCode === stateCode);
          fieldValue = selectedState?.name || stateCode;
        }
        
        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
          transformedData[fieldKey] = fieldValue;
        }
      });
      
      if (inviteCodeField) {
        const inviteCodeKey = getFieldNameForSubmission(inviteCodeField);
        transformedData[inviteCodeKey] = '';
      }

      const submissionPayload = {
        formId: formHandler.id,
        brandId: formHandler.brand_id,
        data: transformedData,
        file: null
      };

      const result = await submitAndProcessForm(submissionPayload);

      if (result?.submitResult) {
        if (result.submitResult.stripe_client_secret) {
          router.push('/payment');
        } else {
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
    const fieldName = field.name || field.label || '';

    const isChecked = rawValue === true || fieldValue === 'true';

    switch (fieldType) {
      case 'text':
      case 'email':
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

      case 'password':
        const isPasswordVisible = showPasswords[fieldId] || false;
        const passwordError = fieldErrors[fieldId];
        const nameLower = (fieldName || '').toLowerCase();
        const isPasswordField = nameLower.includes('password');
        
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldLabel} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                value={fieldValue}
                onChange={(e) => handleInputChange(fieldId, e.target.value)}
                placeholder={fieldPlaceholder}
                required={field.required}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder:text-sm focus:outline-none focus:ring-[#E3418B] focus:border-[#E3418B] ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(fieldId)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {isPasswordVisible ? (
                  <EyeOff size={20} className="text-gray-500" />
                ) : (
                  <Eye size={20} className="text-gray-500" />
                )}
              </button>
            </div>
            {isPasswordField && passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
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

  const getFieldType = (field: FormField): 'text' | 'email' | 'date' | 'select' | 'password' | 'other' => {
    const fieldName = (field.name || field.label || '').toLowerCase();
    const fieldType = field.type || 'text';
    
    if (fieldType === 'password') return 'password';
    if (fieldType === 'email' || fieldName.includes('email')) return 'email';
    if (fieldType === 'date' || fieldName.includes('date') || fieldName.includes('birthday') || fieldName.includes('birth')) return 'date';
    if (fieldType === 'select' || fieldType === 'dropdown' || fieldName.includes('country') || fieldName.includes('state') || fieldName.includes('city')) return 'select';
    return 'text';
  };

  const renderFieldWithFloating = (field: FormField) => {
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
    const fieldName = (field.name || field.label || '').toLowerCase();
    const fieldType = getFieldType(field);

    if (fieldType === 'password') {
      const isPasswordVisible = showPasswords[fieldId] || false;
      const passwordError = fieldErrors[fieldId];
      
      return (
        <div key={field.id} className="relative">
          <FloatingInput
            id={fieldId.toString()}
            title={fieldLabel}
            type={isPasswordVisible ? 'text' : 'password'}
            value={fieldValue}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            width="100%"
            className={passwordError ? 'border-red-500' : ''}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(fieldId)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
            tabIndex={-1}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} className="text-gray-500" />
            ) : (
              <Eye size={20} className="text-gray-500" />
            )}
          </button>
          {passwordError && (
            <p className="mt-1 text-sm text-red-500">{passwordError}</p>
          )}
        </div>
      );
    }

    if (fieldType === 'select') {
      if (fieldName.includes('country')) {
        return (
          <FloatingSelect
            key={field.id}
            label={fieldLabel}
            value={countryCode}
            onChange={(val) => {
              setCountryCode(val);
              setStateCode('');
              const selectedCountry = countries.find(c => c.isoCode === val);
              handleInputChange(fieldId, selectedCountry?.name || val);
            }}
          >
            {countries.map((c) => (
              <SelectItem key={c.isoCode} value={c.isoCode}>
                {c.name}
              </SelectItem>
            ))}
          </FloatingSelect>
        );
      }
      if (fieldName.includes('state')) {
        return (
          <FloatingSelect
            key={field.id}
            label={fieldLabel}
            value={stateCode}
            onChange={(val) => {
              setStateCode(val);
              const selectedState = states.find(s => s.isoCode === val);
              handleInputChange(fieldId, selectedState?.name || val);
            }}
            disabled={!countryCode}
          >
            {states.map((s) => (
              <SelectItem key={s.isoCode} value={s.isoCode}>
                {s.name}
              </SelectItem>
            ))}
          </FloatingSelect>
        );
      }
      if (fieldName.includes('city')) {
        return (
          <FloatingSelect
            key={field.id}
            label={fieldLabel}
            value={fieldValue}
            onChange={(val) => handleInputChange(fieldId, val)}
            disabled={!stateCode}
          >
            {cities.map((cityObj) => (
              <SelectItem key={cityObj.name} value={cityObj.name}>
                {cityObj.name}
              </SelectItem>
            ))}
          </FloatingSelect>
        );
      }
    }

    return (
      <FloatingInput
        key={field.id}
        id={fieldId.toString()}
        title={fieldLabel}
        type={fieldType === 'date' ? 'date' : fieldType === 'email' ? 'email' : 'text'}
        value={fieldValue}
        onChange={(e) => handleInputChange(fieldId, e.target.value)}
        width="100%"
      />
    );
  };

  return (
    <div className="max-w-lg w-full mx-auto">
      <div className="text-center mb-6">
        <p className="text-center poppin-font text-[36px] font-medium mb-2">Enter your info</p>
        <p className="text-center font-poppins">Please enter your information</p>
      </div>


      {parsedFields.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {parsedFields
            .filter(field => {
              const fieldName = field.name || field.label || '';
              const nameLower = fieldName.toLowerCase();
              return !(nameLower.includes('invite') || nameLower.includes('referral') || nameLower.includes('code'));
            })
            .map(field => renderFieldWithFloating(field))}

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submitError}
            </div>
          )}

          <GlobalButton
            title={isSubmitting ? 'Submitting...' : 'Submit'}
            height="50px"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            disabled={isSubmitting}
          />
        </form>
      ) : (
        <p className="text-gray-500">No form fields available.</p>
      )}
    </div>
  );
};
