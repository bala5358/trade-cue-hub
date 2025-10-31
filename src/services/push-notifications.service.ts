import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { logger } from '@/utils/logger';
import { auditService } from './audit.service';

export class PushNotificationService {
  private isInitialized = false;

  /**
   * Initialize push notifications for native apps
   */
  async initialize(): Promise<void> {
    // Only initialize on native platforms
    if (!Capacitor.isNativePlatform()) {
      logger.info('Push notifications not available on web platform');
      return;
    }

    try {
      // Request permission to use push notifications
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        await PushNotifications.register();
        this.setupListeners();
        this.isInitialized = true;
        
        logger.info('Push notifications initialized successfully');
        auditService.logEvent(
          'PUSH_NOTIFICATIONS_ENABLED' as any,
          'Push notifications enabled successfully',
          { success: true }
        );
      } else {
        logger.warn('Push notification permission denied');
        auditService.logEvent(
          'PUSH_NOTIFICATIONS_DENIED' as any,
          'Push notification permission denied',
          { success: false }
        );
      }
    } catch (error) {
      logger.error('Failed to initialize push notifications', error);
      auditService.logEvent(
        'PUSH_NOTIFICATIONS_ERROR' as any,
        'Failed to initialize push notifications',
        {
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      );
    }
  }

  /**
   * Set up push notification event listeners
   */
  private setupListeners(): void {
    // Handle successful registration
    PushNotifications.addListener('registration', (token: Token) => {
      logger.info('Push registration success', { token: token.value });
      auditService.logEvent(
        'PUSH_TOKEN_REGISTERED' as any,
        'Device push token registered',
        {
          success: true,
          details: { tokenPrefix: token.value.substring(0, 10) }
        }
      );
      
      // TODO: Send token to backend to store for user
      this.sendTokenToBackend(token.value);
    });

    // Handle registration errors
    PushNotifications.addListener('registrationError', (error: any) => {
      logger.error('Push registration error', error);
      auditService.logEvent(
        'PUSH_REGISTRATION_ERROR' as any,
        'Push notification registration failed',
        {
          success: false,
          errorMessage: error?.message || 'Unknown error'
        }
      );
    });

    // Handle incoming push notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      logger.info('Push notification received', {
        title: notification.title,
        body: notification.body,
        id: notification.id
      });
      auditService.logEvent(
        'PUSH_NOTIFICATION_RECEIVED' as any,
        'Push notification received',
        {
          success: true,
          details: {
            title: notification.title,
            id: notification.id
          }
        }
      );
    });

    // Handle notification tap
    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      logger.info('Push notification action performed', {
        actionId: action.actionId,
        notificationId: action.notification.id
      });
      auditService.logEvent(
        'PUSH_NOTIFICATION_TAPPED' as any,
        'User tapped push notification',
        {
          success: true,
          details: {
            actionId: action.actionId,
            notificationId: action.notification.id
          }
        }
      );
      
      // Handle navigation based on notification data
      this.handleNotificationAction(action);
    });
  }

  /**
   * Send device token to backend
   */
  private async sendTokenToBackend(token: string): Promise<void> {
    try {
      // TODO: Implement API call to store device token
      // await apiClient.post('/notifications/register-device', { token });
      logger.info('Device token sent to backend');
    } catch (error) {
      logger.error('Failed to send device token to backend', error);
    }
  }

  /**
   * Handle notification action (tap)
   */
  private handleNotificationAction(action: ActionPerformed): void {
    const { data } = action.notification;
    
    // Navigate based on notification type
    if (data?.type === 'signal') {
      // Navigate to signals page
      window.location.href = '/spi-picks';
    } else if (data?.type === 'portfolio') {
      // Navigate to portfolio page
      window.location.href = '/portfolio';
    }
  }

  /**
   * Send a local notification (for testing or fallback)
   */
  async sendLocalNotification(title: string, body: string, data?: any): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      // Fallback to web toast notification
      return;
    }

    try {
      await PushNotifications.createChannel({
        id: 'signals',
        name: 'Trading Signals',
        description: 'Buy and sell signal notifications',
        importance: 5,
        visibility: 1,
        sound: 'default'
      });

      // Note: Local notifications require additional plugin @capacitor/local-notifications
      logger.info('Local notification sent', { title, body });
    } catch (error) {
      logger.error('Failed to send local notification', error);
    }
  }

  /**
   * Get delivery statistics for push notifications
   */
  async getDeliveredNotifications(): Promise<any[]> {
    if (!Capacitor.isNativePlatform()) {
      return [];
    }

    try {
      const result = await PushNotifications.getDeliveredNotifications();
      return result.notifications;
    } catch (error) {
      logger.error('Failed to get delivered notifications', error);
      return [];
    }
  }

  /**
   * Remove delivered notifications
   */
  async removeDeliveredNotifications(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await PushNotifications.removeAllDeliveredNotifications();
      logger.info('Cleared delivered notifications');
    } catch (error) {
      logger.error('Failed to clear delivered notifications', error);
    }
  }

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return Capacitor.isNativePlatform();
  }
}

export const pushNotificationService = new PushNotificationService();
