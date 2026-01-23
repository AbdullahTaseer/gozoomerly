

import { CreateBirthdayBoardInput } from '../types/board';

export function validateBirthdayBoardInput(input: Partial<CreateBirthdayBoardInput>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.p_board_type_id) {
    errors.push('Board type is required');
  }

  if (!input.p_title || input.p_title.trim() === '') {
    errors.push('Board title is required');
  }

  if (!input.p_honoree_first_name || input.p_honoree_first_name.trim() === '') {
    errors.push('Honoree first name is required');
  }

  if (!input.p_honoree_last_name || input.p_honoree_last_name.trim() === '') {
    errors.push('Honoree last name is required');
  }

  if (!input.p_honoree_date_of_birth) {
    errors.push('Honoree date of birth is required');
  } else {

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input.p_honoree_date_of_birth)) {
      errors.push('Date of birth must be in YYYY-MM-DD format');
    }
  }

  if (!input.p_honoree_hometown || input.p_honoree_hometown.trim() === '') {
    errors.push('Honoree hometown is required');
  }

  if (input.p_honoree_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.p_honoree_email)) {
      errors.push('Invalid email address');
    }
  }

  if (input.p_honoree_phone) {
    // Phone number must start with + (country code is required)
    if (!input.p_honoree_phone.startsWith('+')) {
      errors.push('Phone number must include country code (e.g., +1234567890)');
    } else {
      const phoneRegex = /^\+[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(input.p_honoree_phone)) {
        errors.push('Invalid phone number format');
      }
      // Ensure there are digits after the country code
      const digitsAfterPlus = input.p_honoree_phone.replace(/^\+/, '').replace(/[\s\-\(\)]/g, '');
      if (digitsAfterPlus.length < 7) {
        errors.push('Phone number is too short');
      }
      if (digitsAfterPlus.length > 15) {
        errors.push('Phone number is too long');
      }
    }
  }

  if (input.p_target_amount !== undefined && input.p_target_amount <= 0) {
    errors.push('Target amount must be greater than 0');
  }

  if (input.p_expiry_date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input.p_expiry_date)) {
      errors.push('Expiry date must be in YYYY-MM-DD format');
    } else {
      const expiryDate = new Date(input.p_expiry_date);
      const today = new Date();
      if (expiryDate <= today) {
        errors.push('Expiry date must be in the future');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function transformFormToInput(formValues: any): CreateBirthdayBoardInput {
  return {
    p_board_type_id: formValues.board_type_id || formValues.p_board_type_id,
    p_title: formValues.title || formValues.p_title,
    p_honoree_first_name: formValues.first_name || formValues.p_honoree_first_name,
    p_honoree_last_name: formValues.last_name || formValues.p_honoree_last_name,
    p_honoree_date_of_birth: formValues.date_of_birth || formValues.p_honoree_date_of_birth,
    p_honoree_hometown: formValues.hometown || formValues.p_honoree_hometown,
    p_description: formValues.description || formValues.p_description,
    p_honoree_phone: formValues.phone || formValues.p_honoree_phone,
    p_honoree_email: formValues.email || formValues.p_honoree_email,
    p_honoree_profile_photo_url: formValues.profile_photo_url || formValues.p_honoree_profile_photo_url,
    p_honoree_theme_color: formValues.theme_color || formValues.p_honoree_theme_color || '#CE7ADD',
    p_surprise_mode_enabled: formValues.surprise_mode_enabled ?? formValues.p_surprise_mode_enabled ?? false,
    p_theme: formValues.theme || formValues.p_theme || 'fun-colorful',
    p_target_amount: formValues.goal_amount || formValues.target_amount || formValues.p_target_amount,
    p_expiry_date: formValues.deadline_date || formValues.expiry_date || formValues.p_expiry_date,
    p_currency: formValues.currency || formValues.p_currency || 'USD',
    p_privacy: formValues.privacy || formValues.p_privacy || 'public',
    p_allow_invites: formValues.allow_invites ?? formValues.p_allow_invites ?? true,
    p_invites_can_invite: formValues.invites_can_invite ?? formValues.p_invites_can_invite ?? false,
    p_cover_media_id: formValues.cover_media_id || formValues.p_cover_media_id,
    p_seo_meta_tags: formValues.seo_meta_tags || formValues.p_seo_meta_tags,
  };
}

export function getDefaultBirthdayBoardValues(): Partial<CreateBirthdayBoardInput> {
  return {
    p_honoree_theme_color: '#CE7ADD',
    p_surprise_mode_enabled: false,
    p_theme: 'fun-colorful',
    p_currency: 'USD',
    p_privacy: 'public',
    p_allow_invites: true,
    p_invites_can_invite: false,
  };
}
