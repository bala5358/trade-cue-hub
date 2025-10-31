import { z } from 'zod';

// Sanitize string inputs to prevent XSS
const sanitizedString = (maxLength: number, minLength: number = 0) =>
  z
    .string()
    .trim()
    .min(minLength, minLength > 0 ? `Input must be at least ${minLength} characters` : undefined)
    .max(maxLength, `Input must not exceed ${maxLength} characters`)
    .transform((val) => val.replace(/[<>]/g, '')); // Basic XSS prevention

// URL validation
const urlSchema = z
  .string()
  .trim()
  .max(2048, 'URL must not exceed 2048 characters')
  .url('Please enter a valid URL')
  .refine((url) => url.startsWith('https://'), 'URL must use HTTPS');

// Email validation
const emailSchema = z
  .string()
  .trim()
  .max(255, 'Email must not exceed 255 characters')
  .email('Please enter a valid email address')
  .toLowerCase();

// Port validation
const portSchema = z
  .number()
  .int('Port must be an integer')
  .min(1, 'Port must be at least 1')
  .max(65535, 'Port must not exceed 65535');

// App settings schema
export const appSettingsSchema = z.object({
  appName: sanitizedString(100, 1),
  appDescription: sanitizedString(500),
  maintenanceMode: z.boolean(),
  apiRateLimitingEnabled: z.boolean(),
});

// Email config schema
export const emailConfigSchema = z.object({
  smtpHost: z
    .string()
    .trim()
    .min(1, 'SMTP host is required')
    .max(255, 'SMTP host must not exceed 255 characters'),
  smtpPort: portSchema,
  fromEmail: emailSchema,
  emailNotificationsEnabled: z.boolean(),
});

// API config schema (if needed)
export const apiConfigSchema = z.object({
  azureEndpoint: urlSchema.optional().or(z.literal('')),
  apiVersion: z
    .string()
    .trim()
    .max(20, 'API version must not exceed 20 characters')
    .optional()
    .or(z.literal('')),
});

// IP address validation for whitelist
export const ipAddressSchema = z
  .string()
  .trim()
  .regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    'Please enter a valid IPv4 address'
  );

export type AppSettingsInput = z.infer<typeof appSettingsSchema>;
export type EmailConfigInput = z.infer<typeof emailConfigSchema>;
export type ApiConfigInput = z.infer<typeof apiConfigSchema>;
