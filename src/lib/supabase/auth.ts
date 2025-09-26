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

export interface SignUpCredentials extends SignInCredentials {
  phoneNumber?: string;
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