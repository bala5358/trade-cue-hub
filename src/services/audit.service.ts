import { trackEvent, SeverityLevel, trackTrace } from './appInsights.service';

// Audit event types
export enum AuditEventType {
  // Authentication
  LOGIN = 'USER_LOGIN',
  LOGOUT = 'USER_LOGOUT',
  LOGIN_FAILED = 'USER_LOGIN_FAILED',
  SIGNUP = 'USER_SIGNUP',
  PASSWORD_RESET = 'PASSWORD_RESET_REQUEST',
  
  // User Actions
  PROFILE_UPDATE = 'PROFILE_UPDATED',
  SETTINGS_UPDATE = 'SETTINGS_UPDATED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGED',
  
  // Trading Actions
  SIGNAL_VIEW = 'SIGNAL_VIEWED',
  STOCK_PICK_VIEW = 'STOCK_PICK_VIEWED',
  WATCHLIST_ADD = 'WATCHLIST_ITEM_ADDED',
  WATCHLIST_REMOVE = 'WATCHLIST_ITEM_REMOVED',
  TRADE_EXECUTED = 'TRADE_EXECUTED',
  
  // Admin Actions
  ADMIN_SETTINGS_UPDATE = 'ADMIN_SETTINGS_UPDATED',
  USER_ROLE_CHANGE = 'USER_ROLE_CHANGED',
  
  // API Actions
  API_CALL = 'API_CALL_MADE',
  API_ERROR = 'API_ERROR_OCCURRED',
  
  // Security
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS_ATTEMPT',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY_DETECTED',
}

// Audit log interface
export interface AuditLog {
  eventType: AuditEventType;
  userId?: string;
  userName?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

class AuditService {
  // Log an audit event
  logEvent(
    eventType: AuditEventType,
    action: string,
    options: {
      userId?: string;
      userName?: string;
      resource?: string;
      resourceId?: string;
      details?: Record<string, any>;
      success?: boolean;
      errorMessage?: string;
    } = {}
  ): void {
    const auditLog: AuditLog = {
      eventType,
      userId: options.userId,
      userName: options.userName,
      action,
      resource: options.resource,
      resourceId: options.resourceId,
      details: options.details,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      success: options.success ?? true,
      errorMessage: options.errorMessage,
    };

    // Send to Application Insights
    trackEvent(eventType, auditLog);

    // Also log as trace for searchability
    const severity = options.success === false ? SeverityLevel.Error : SeverityLevel.Information;
    trackTrace(
      `Audit: ${eventType} - ${action}`,
      severity,
      auditLog
    );

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('[AUDIT]', auditLog);
    }
  }

  // Authentication audit logs
  logLogin(userId: string, userName: string, success: boolean, errorMessage?: string): void {
    this.logEvent(
      success ? AuditEventType.LOGIN : AuditEventType.LOGIN_FAILED,
      success ? 'User logged in successfully' : 'User login failed',
      { userId, userName, success, errorMessage }
    );
  }

  logLogout(userId: string, userName: string): void {
    this.logEvent(
      AuditEventType.LOGOUT,
      'User logged out',
      { userId, userName }
    );
  }

  logSignup(userId: string, userName: string): void {
    this.logEvent(
      AuditEventType.SIGNUP,
      'New user signed up',
      { userId, userName }
    );
  }

  // User action audit logs
  logProfileUpdate(userId: string, fieldsUpdated: string[]): void {
    this.logEvent(
      AuditEventType.PROFILE_UPDATE,
      'User profile updated',
      {
        userId,
        details: { fieldsUpdated },
      }
    );
  }

  logSettingsUpdate(userId: string, settings: Record<string, any>): void {
    this.logEvent(
      AuditEventType.SETTINGS_UPDATE,
      'User settings updated',
      {
        userId,
        details: { settings },
      }
    );
  }

  // Trading action audit logs
  logSignalView(userId: string, signalId: string, stockSymbol: string): void {
    this.logEvent(
      AuditEventType.SIGNAL_VIEW,
      'User viewed trading signal',
      {
        userId,
        resource: 'signal',
        resourceId: signalId,
        details: { stockSymbol },
      }
    );
  }

  logWatchlistAdd(userId: string, stockSymbol: string, stockName: string): void {
    this.logEvent(
      AuditEventType.WATCHLIST_ADD,
      'Stock added to watchlist',
      {
        userId,
        resource: 'watchlist',
        details: { stockSymbol, stockName },
      }
    );
  }

  logWatchlistRemove(userId: string, stockSymbol: string): void {
    this.logEvent(
      AuditEventType.WATCHLIST_REMOVE,
      'Stock removed from watchlist',
      {
        userId,
        resource: 'watchlist',
        details: { stockSymbol },
      }
    );
  }

  // API audit logs
  logApiCall(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    userId?: string
  ): void {
    this.logEvent(
      AuditEventType.API_CALL,
      `API ${method} ${endpoint}`,
      {
        userId,
        resource: 'api',
        details: {
          endpoint,
          method,
          statusCode,
          responseTime,
        },
        success: statusCode >= 200 && statusCode < 400,
      }
    );
  }

  logApiError(
    endpoint: string,
    method: string,
    errorMessage: string,
    userId?: string
  ): void {
    this.logEvent(
      AuditEventType.API_ERROR,
      `API error: ${method} ${endpoint}`,
      {
        userId,
        resource: 'api',
        details: { endpoint, method },
        success: false,
        errorMessage,
      }
    );
  }

  // Security audit logs
  logUnauthorizedAccess(resource: string, userId?: string): void {
    this.logEvent(
      AuditEventType.UNAUTHORIZED_ACCESS,
      'Unauthorized access attempt detected',
      {
        userId,
        resource,
        success: false,
      }
    );
  }

  logSuspiciousActivity(description: string, details: Record<string, any>, userId?: string): void {
    this.logEvent(
      AuditEventType.SUSPICIOUS_ACTIVITY,
      description,
      {
        userId,
        details,
        success: false,
      }
    );
  }

  // Admin audit logs
  logAdminSettingsUpdate(adminId: string, settingsChanged: Record<string, any>): void {
    this.logEvent(
      AuditEventType.ADMIN_SETTINGS_UPDATE,
      'Admin settings updated',
      {
        userId: adminId,
        resource: 'admin_settings',
        details: { settingsChanged },
      }
    );
  }

  // Helper to get client IP (best effort)
  private getClientIP(): string | undefined {
    // In production, this would typically come from the server
    // For now, return undefined as client-side can't reliably get this
    return undefined;
  }
}

export const auditService = new AuditService();
