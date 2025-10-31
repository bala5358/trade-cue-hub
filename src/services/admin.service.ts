// Admin service
import { apiClient } from './api-client';
import {
  AdminSettingsResponse,
  UpdateAppSettingsRequest,
  UpdateEmailConfigRequest,
  SecuritySettings,
  UpdateSecuritySettingsRequest,
  IpWhitelistResponse,
  AddIpWhitelistRequest,
  IpWhitelistEntry,
  AdminUsersResponse,
  UpdateUserRolesRequest,
  AuditLogsResponse,
  AppSettings,
} from '@/types/admin.types';

export class AdminService {
  // Settings Management
  async getSettings(): Promise<AdminSettingsResponse> {
    return apiClient.get<AdminSettingsResponse>('/admin/settings');
  }

  async updateAppSettings(data: UpdateAppSettingsRequest): Promise<{ success: boolean; settings: AppSettings }> {
    return apiClient.put('/admin/settings/app', data);
  }

  async updateEmailConfig(data: UpdateEmailConfigRequest): Promise<{ success: boolean; message: string }> {
    return apiClient.put('/admin/settings/email', data);
  }

  // Security Management
  async getSecuritySettings(): Promise<SecuritySettings> {
    return apiClient.get<SecuritySettings>('/admin/security');
  }

  async updateSecuritySettings(data: UpdateSecuritySettingsRequest): Promise<{ success: boolean; settings: SecuritySettings }> {
    return apiClient.put('/admin/security', data);
  }

  async getIpWhitelist(): Promise<IpWhitelistResponse> {
    return apiClient.get<IpWhitelistResponse>('/admin/security/ip-whitelist');
  }

  async addIpToWhitelist(data: AddIpWhitelistRequest): Promise<{ success: boolean; entry: IpWhitelistEntry }> {
    return apiClient.post('/admin/security/ip-whitelist', data);
  }

  async removeIpFromWhitelist(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/admin/security/ip-whitelist/${id}`);
  }

  // User Management
  async getUsers(params: {
    role?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<AdminUsersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.role) {
      queryParams.append('role', params.role);
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }

    const query = queryParams.toString();
    return apiClient.get<AdminUsersResponse>(`/admin/users${query ? `?${query}` : ''}`);
  }

  async updateUserRoles(userId: string, data: UpdateUserRolesRequest): Promise<{ success: boolean; message: string }> {
    return apiClient.put(`/admin/users/${userId}/roles`, data);
  }

  // Audit Logs
  async getAuditLogs(params: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<AuditLogsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.userId) {
      queryParams.append('userId', params.userId);
    }
    if (params.action) {
      queryParams.append('action', params.action);
    }
    if (params.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }

    const query = queryParams.toString();
    return apiClient.get<AuditLogsResponse>(`/admin/audit-logs${query ? `?${query}` : ''}`);
  }
}

export const adminService = new AdminService();
