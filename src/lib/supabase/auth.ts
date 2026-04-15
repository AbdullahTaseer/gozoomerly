import { createClient } from './client';
import { AuthError } from '@supabase/supabase-js';

// Types
export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface PhoneSignInCredentials {
  phone: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  phoneNumber?: string;
}

export interface PhoneSignUpCredentials {
  phone: string;
  password: string;
}

export interface PhoneOTPCredentials {
  phone: string;
}

export interface EmailOTPCredentials {
  email: string;
}

export interface UserInfo {
  fullName: string;
  birthDate: string;
  country: string;
  state: string;
  city: string;
  avatar?: string | null;
}

export interface VerifyOTPCredentials {
  phone: string;
  token: string;
  password: string;
  userInfo?: UserInfo;
}

export interface VerifyEmailOTPCredentials {
  email: string;
  token: string;
  password: string;
  userInfo?: UserInfo;
}

export interface VerifyEmailOTPCodeCredentials {
  email: string;
  token: string;
}

// Auth Service
export class AuthService {
  // Lazily create client to avoid build-time crashes during prerender/import.
  private get supabase() {
    return createClient();
  }

  // Sign In Methods
  async signInWithEmail(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      this.storeAccessToken(data.session?.access_token);

      return {
        success: true,
        data: { user: data.user, session: data.session },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async signInWithPhone(credentials: PhoneSignInCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        phone: credentials.phone,
        password: credentials.password,
      });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      this.storeAccessToken(data.session?.access_token);

      return {
        success: true,
        data: { user: data.user, session: data.session },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  // Sign Up Methods
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: { phone_number: credentials.phoneNumber },
        },
      });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      return {
        success: true,
        data: { user: data.user, session: data.session },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  // Sign Out
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      this.removeAccessToken();

      return { success: true };
    } catch {
      return { success: false, error: 'An unexpected error occurred while signing out.' };
    }
  }

  // OTP Methods
  async sendPhoneOTP(credentials: PhoneOTPCredentials): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.signInWithOtp({
        phone: credentials.phone,
      });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      return {
        success: true,
        data: { message: 'OTP sent successfully to your phone number.' },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async sendEmailOTP(credentials: EmailOTPCredentials): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.signInWithOtp({
        email: credentials.email,
        options: { shouldCreateUser: true },
      });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      return {
        success: true,
        data: { message: 'OTP sent successfully to your email.' },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async verifyPhoneOTP(credentials: VerifyOTPCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        phone: credentials.phone,
        token: credentials.token,
        type: 'sms',
      });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      const updateData = this.buildUserUpdateData(credentials.password, credentials.userInfo, credentials.phone);
      const { error: updateError } = await this.supabase.auth.updateUser(updateData);

      if (updateError) {
        return { success: false, error: this.handleAuthError(updateError) };
      }

      this.storeAccessToken(data.session?.access_token);

      return {
        success: true,
        data: { user: data.user, session: data.session },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async verifyEmailOTPCode(credentials: VerifyEmailOTPCodeCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        email: credentials.email,
        token: credentials.token,
        type: 'email',
      });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      this.storeAccessToken(data.session?.access_token);

      return {
        success: true,
        data: { user: data.user, session: data.session },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async verifyEmailOTP(credentials: VerifyEmailOTPCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        email: credentials.email,
        token: credentials.token,
        type: 'email',
      });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      const updateData = this.buildUserUpdateData(credentials.password, credentials.userInfo);
      const { error: updateError } = await this.supabase.auth.updateUser(updateData);

      if (updateError) {
        return { success: false, error: this.handleAuthError(updateError) };
      }

      this.storeAccessToken(data.session?.access_token);

      return {
        success: true,
        data: { user: data.user, session: data.session },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  // Profile Update Methods
  async updateUserProfile(profile: any): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.auth.updateUser({ data: profile });

      if (error) {
        return { error: this.handleAuthError(error) };
      }

      return {};
    } catch {
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async updateEmail(newEmail: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.updateUser({ email: newEmail });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      return {
        success: true,
        data: {
          user: data.user,
          message: 'Email update initiated. Please check your new email for confirmation.',
        },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.updateUser({ password: newPassword });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      return {
        success: true,
        data: { user: data.user, message: 'Password updated successfully.' },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: this.handleAuthError(error) };
      }

      return {
        success: true,
        data: { message: 'Password reset email sent. Please check your inbox.' },
      };
    } catch {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  // Session & User Methods
  async getSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      return error ? null : data.session;
    } catch {
      return null;
    }
  }

  async getUser() {
    try {
      const { data, error } = await this.supabase.auth.getUser();
      return error ? null : data.user;
    } catch {
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      return session?.access_token || null;
    } catch {
      return null;
    }
  }

  // Private Helper Methods
  private storeAccessToken(token?: string): void {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('access_token', token);
    }
  }

  private removeAccessToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  private buildUserUpdateData(password: string, userInfo?: UserInfo, phone?: string): any {
    const updateData: any = { password };

    if (userInfo) {
      updateData.data = {
        full_name: userInfo.fullName,
        birth_date: userInfo.birthDate,
        country: userInfo.country,
        state: userInfo.state,
        city: userInfo.city,
        avatar_url: userInfo.avatar,
        ...(phone && { phone }),
      };
    }

    return updateData;
  }

  private handleAuthError(error: AuthError): string {
    switch (error.status) {
      case 400:
        if (error.message.includes('Invalid login credentials')) {
          return 'Invalid email or password';
        }
        if (error.message.includes('User already registered')) {
          return 'An account with this email already exists';
        }
        return 'Invalid request. Please check your information.';
      case 422:
        return 'Invalid email format';
      case 429:
        return 'Too many attempts. Please try again later.';
      default:
        return error.message || 'Authentication failed. Please try again.';
    }
  }
}

export const authService = new AuthService();
