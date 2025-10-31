import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

// Azure Application Insights configuration
const APPINSIGHTS_CONNECTION_STRING = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;

let appInsights: ApplicationInsights | null = null;
let reactPlugin: ReactPlugin | null = null;

// Initialize Application Insights
export const initializeAppInsights = (): { appInsights: ApplicationInsights | null; reactPlugin: ReactPlugin | null } => {
  // Only initialize if connection string is provided
  if (!APPINSIGHTS_CONNECTION_STRING) {
    console.warn('Application Insights connection string not found. Analytics disabled.');
    return { appInsights: null, reactPlugin: null };
  }

  try {
    reactPlugin = new ReactPlugin();
    
    appInsights = new ApplicationInsights({
      config: {
        connectionString: APPINSIGHTS_CONNECTION_STRING,
        enableAutoRouteTracking: true, // Track route changes
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
        enableCorsCorrelation: true,
        enableUnhandledPromiseRejectionTracking: true,
        disableFetchTracking: false,
        disableAjaxTracking: false,
        extensions: [reactPlugin],
      }
    });

    appInsights.loadAppInsights();
    
    // Track initial page view
    appInsights.trackPageView();

    console.log('Application Insights initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Application Insights:', error);
    appInsights = null;
    reactPlugin = null;
  }

  return { appInsights, reactPlugin };
};

// Get the current Application Insights instance
export const getAppInsights = (): ApplicationInsights | null => {
  return appInsights;
};

// Get the React Plugin instance
export const getReactPlugin = (): ReactPlugin | null => {
  return reactPlugin;
};

// Track custom events
export const trackEvent = (
  name: string,
  properties?: Record<string, any>
) => {
  if (appInsights) {
    appInsights.trackEvent({ name, properties });
  }
};

// Track page views
export const trackPageView = (name?: string, properties?: Record<string, any>) => {
  if (appInsights) {
    appInsights.trackPageView({ name, properties });
  }
};

// Track exceptions
export const trackException = (
  error: Error,
  severityLevel?: number,
  properties?: Record<string, any>
) => {
  if (appInsights) {
    appInsights.trackException({ 
      exception: error,
      severityLevel,
      properties 
    });
  }
};

// Track metrics
export const trackMetric = (
  name: string,
  average: number,
  properties?: Record<string, any>
) => {
  if (appInsights) {
    appInsights.trackMetric({ name, average }, properties);
  }
};

// Track traces/logs
export const trackTrace = (
  message: string,
  severityLevel?: number,
  properties?: Record<string, any>
) => {
  if (appInsights) {
    appInsights.trackTrace({ message, severityLevel }, properties);
  }
};

// Severity levels for Application Insights
export const SeverityLevel = {
  Verbose: 0,
  Information: 1,
  Warning: 2,
  Error: 3,
  Critical: 4,
} as const;

// Set authenticated user context
export const setAuthenticatedUserContext = (
  authenticatedUserId: string,
  accountId?: string
) => {
  if (appInsights) {
    appInsights.setAuthenticatedUserContext(authenticatedUserId, accountId);
  }
};

// Clear authenticated user context
export const clearAuthenticatedUserContext = () => {
  if (appInsights) {
    appInsights.clearAuthenticatedUserContext();
  }
};

// Flush telemetry
export const flushTelemetry = async (): Promise<void> => {
  if (appInsights) {
    appInsights.flush();
  }
};
