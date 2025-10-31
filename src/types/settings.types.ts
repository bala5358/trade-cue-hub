// User settings types
export interface UserSettings {
  id: string;
  userId: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsAlerts: boolean;
  weekendNotifications: boolean;
  indiaMarketEnabled: boolean;
  usMarketEnabled: boolean;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  smsAlerts?: boolean;
  weekendNotifications?: boolean;
  indiaMarketEnabled?: boolean;
  usMarketEnabled?: boolean;
}
