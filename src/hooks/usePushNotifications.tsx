import { useEffect } from 'react';
import { pushNotificationService } from '@/services/push-notifications.service';
import { logger } from '@/utils/logger';

/**
 * Hook to initialize and manage push notifications
 */
export const usePushNotifications = () => {
  useEffect(() => {
    const initPushNotifications = async () => {
      try {
        await pushNotificationService.initialize();
      } catch (error) {
        logger.error('Failed to initialize push notifications in hook', error);
      }
    };

    initPushNotifications();
  }, []);

  return {
    isSupported: pushNotificationService.isSupported(),
    sendLocalNotification: pushNotificationService.sendLocalNotification.bind(pushNotificationService),
    getDeliveredNotifications: pushNotificationService.getDeliveredNotifications.bind(pushNotificationService),
    removeDeliveredNotifications: pushNotificationService.removeDeliveredNotifications.bind(pushNotificationService)
  };
};
