// Azure API authentication service integration
import { authService as azureAuthService } from '@/services';
import type { User } from '@/types/auth.types';

export type { User };

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await azureAuthService.login({ email, password });
      return {
        success: response.success,
        user: response.user,
        error: response.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },

  async signup(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      const [firstName = '', lastName = ''] = name?.split(' ') || ['', ''];
      const response = await azureAuthService.register({
        email,
        password,
        firstName,
        lastName,
      });
      return {
        success: response.success,
        user: response.user,
        error: response.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      };
    }
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await azureAuthService.forgotPassword({ email });
      return {
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await azureAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await azureAuthService.getCurrentUser();
      return response.user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  setUserSession(user: User): void {
    // Token management is handled by apiClient
    localStorage.setItem('superpi_user', JSON.stringify(user));
  },

  clearUserSession(): void {
    localStorage.removeItem('superpi_user');
  },

  async isAdmin(): Promise<boolean> {
    try {
      const roles = await azureAuthService.getUserRoles();
      return roles.isAdmin;
    } catch (error) {
      console.error('Check admin error:', error);
      return false;
    }
  },
};
