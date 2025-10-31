// Authentication service
import { apiClient } from './api-client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  UserProfile,
  UpdateProfileRequest,
  UserRolesResponse,
} from '@/types/auth.types';

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.success && response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    if (response.success && response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.clearToken();
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>('/auth/me');
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/forgot-password', data);
  }

  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/users/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<{ success: boolean; profile: UserProfile }> {
    return apiClient.put('/users/profile', data);
  }

  async getUserRoles(): Promise<UserRolesResponse> {
    return apiClient.get<UserRolesResponse>('/users/roles');
  }
}

export const authService = new AuthService();
