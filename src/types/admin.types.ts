// Admin types
export interface AppSettings {
  id: string;
  appName: string;
  appDescription: string;
  maintenanceMode: boolean;
  apiRateLimitingEnabled: boolean;
  updatedAt: string;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  fromEmail: string;
  emailNotificationsEnabled: boolean;
}

export interface ApiConfig {
  azureEndpoint: string;
  apiVersion: string;
  rateLimitRequests: number;
  rateLimitWindowMinutes: number;
}

export interface NotificationConfig {
  emailEnabled: boolean;
  slackEnabled: boolean;
}

export interface AdminSettingsResponse {
  appSettings: AppSettings;
  emailConfig: EmailConfig;
  apiConfig: ApiConfig;
  notificationConfig: NotificationConfig;
}

export interface UpdateAppSettingsRequest {
  appName?: string;
  appDescription?: string;
  maintenanceMode?: boolean;
  apiRateLimitingEnabled?: boolean;
}

export interface UpdateEmailConfigRequest {
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  fromEmail?: string;
  emailNotificationsEnabled?: boolean;
}

export interface SecuritySettings {
  twoFactorRequired: boolean;
  emailVerificationRequired: boolean;
  strongPasswordRequired: boolean;
  sessionTimeoutMinutes: number;
  rememberMeEnabled: boolean;
  rbacEnabled: boolean;
  ipWhitelistEnabled: boolean;
}

export interface UpdateSecuritySettingsRequest {
  twoFactorRequired?: boolean;
  emailVerificationRequired?: boolean;
  strongPasswordRequired?: boolean;
  sessionTimeoutMinutes?: number;
  rememberMeEnabled?: boolean;
  rbacEnabled?: boolean;
  ipWhitelistEnabled?: boolean;
}

export interface IpWhitelistEntry {
  id: string;
  ipAddress: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface IpWhitelistResponse {
  data: IpWhitelistEntry[];
}

export interface AddIpWhitelistRequest {
  ipAddress: string;
  description: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: string[];
  createdAt: string;
  lastSignInAt?: string;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface UpdateUserRolesRequest {
  roles: string[];
}

export interface AuditLog {
  id: string;
  adminUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: {
    before: any;
    after: any;
  };
  ipAddress: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
