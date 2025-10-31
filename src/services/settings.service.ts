// User settings service
import { apiClient } from './api-client';
import {
  UserSettings,
  UpdateSettingsRequest,
} from '@/types/settings.types';

export class SettingsService {
  async getSettings(): Promise<UserSettings> {
    return apiClient.get<UserSettings>('/settings');
  }

  async updateSettings(data: UpdateSettingsRequest): Promise<{ success: boolean; settings: UserSettings }> {
    return apiClient.put('/settings', data);
  }
}

export const settingsService = new SettingsService();
