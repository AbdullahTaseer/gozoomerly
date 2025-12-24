import { createClient } from './client';
import { AuthError } from '@supabase/supabase-js';

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

export interface VerifyOTPCredentials {
  phone: string;
  token: string;
  password: string;
  userInfo?: {
    fullName: string;
    birthDate: string;
    country: string;
    state: string;
    city: string;
    avatar?: string | null;
  };
}

export class AuthService {
  private supabase = createClient();

  async signInWithEmail(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      
      if (error) {
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }

      // Store access token in localStorage as requested
      if (typeof window !== 'undefined' && data.session?.access_token) {
        localStorage.setItem('access_token', data.session.access_token);
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  async signInWithPhone(credentials: PhoneSignInCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        phone: credentials.phone,
        password: credentials.password,
      });
      
      if (error) {
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }

      // Store access token in localStorage as requested
      if (typeof window !== 'undefined' && data.session?.access_token) {
        localStorage.setItem('access_token', data.session.access_token);
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            phone_number: credentials.phoneNumber,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred while signing out.',
      };
    }
  }

  async sendPhoneOTP(credentials: PhoneOTPCredentials): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.signInWithOtp({
        phone: credentials.phone,
      });

      if (error) {
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }

      return {
        success: true,
        data: {
          message: 'OTP sent successfully to your phone number.',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
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
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }

      const updateData: any = {
        password: credentials.password,
      };

      if (credentials.userInfo) {
        updateData.data = {
          full_name: credentials.userInfo.fullName,
          birth_date: credentials.userInfo.birthDate,
          country: credentials.userInfo.country,
          state: credentials.userInfo.state,
          city: credentials.userInfo.city,
          avatar_url: credentials.userInfo.avatar,
          phone: credentials.phone,
        };
      }

      const { error: updateError } = await this.supabase.auth.updateUser(updateData);

      if (updateError) {
        return {
          success: false,
          error: this.handleAuthError(updateError),
        };
      }

      if (data.session?.access_token) {
        localStorage.setItem('access_token', data.session.access_token);
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  async updateUserProfile(profile: any): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        data: profile
      });

      if (error) {
        return { error: this.handleAuthError(error) };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  }

  async updateEmail(newEmail: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        email: newEmail
      });

      if (error) {
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }

      return {
        success: true,
        data: {
          user: data.user,
          message: 'Email update initiated. Please check your new email for confirmation.',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }

      return {
        success: true,
        data: {
          user: data.user,
          message: 'Password updated successfully.',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }

      return {
        success: true,
        data: {
          message: 'Password reset email sent. Please check your inbox.',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  async getSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession();

      if (error) {
        return null;
      }

      return data.session;
    } catch (error) {
      return null;
    }
  }

  async getUser() {
    try {
      const { data, error } = await this.supabase.auth.getUser();

      if (error) {
        return null;
      }

      return data.user;
    } catch (error) {
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      return null;
    }
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