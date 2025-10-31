import { z } from 'zod';

// User settings validation schema
export const userSettingsSchema = z.object({
  pushNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  smsAlerts: z.boolean().optional(),
  weekendNotifications: z.boolean().optional(),
  indiaMarketEnabled: z.boolean().optional(),
  usMarketEnabled: z.boolean().optional(),
});

export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
