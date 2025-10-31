// Production-safe logging utility
import { trackTrace, trackException, SeverityLevel } from '../services/appInsights.service';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  error: (message: string, error?: Error | unknown, context?: Record<string, unknown>) => {
    // Always log to console in development
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, { error, context });
    }
    
    // Send to Application Insights
    if (error instanceof Error) {
      trackException(error, SeverityLevel.Error, { message, ...context });
    } else {
      trackTrace(
        `ERROR: ${message}`,
        SeverityLevel.Error,
        { error: String(error), ...context }
      );
    }
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, context);
    }
    
    trackTrace(
      `WARN: ${message}`,
      SeverityLevel.Warning,
      context
    );
  },

  info: (message: string, context?: Record<string, unknown>) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, context);
    }
    
    trackTrace(
      `INFO: ${message}`,
      SeverityLevel.Information,
      context
    );
  },

  debug: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data);
      
      // Only send debug logs to App Insights in development
      trackTrace(
        `DEBUG: ${message}`,
        SeverityLevel.Verbose,
        { data }
      );
    }
  },
};

