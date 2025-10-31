import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { b2cConfig } from "@/lib/b2cConfig";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { PageLayout } from "@/components/PageLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { initializeAppInsights } from "@/services/appInsights.service";
import { logger } from "@/utils/logger";
import { usePushNotifications } from "@/hooks/usePushNotifications";

// Eager load
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";

// Lazy load
const Services = lazy(() => import("./pages/Services"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Settings = lazy(() => import("./pages/Settings"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const SpiPicks = lazy(() => import("./pages/SpiPicks"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Security = lazy(() => import("./pages/admin/Security"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Payment = lazy(() => import("./pages/Payment"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="container mx-auto px-4 py-8 space-y-4">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-full max-w-2xl" />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const { appInsights } = initializeAppInsights();
if (appInsights) {
  logger.info("Application started with monitoring enabled");
} else {
  logger.warn("Application started without monitoring - Application Insights not configured");
}

const App = () => {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  // Initialize push notifications for mobile
  usePushNotifications();

  useEffect(() => {
    logger.info("Application mounted");

    const initializeMsal = async () => {
      const instance = new PublicClientApplication(b2cConfig);
      await instance.initialize(); // ✅ critical fix
      setMsalInstance(instance);
    };

    initializeMsal();

    return () => {
      logger.info("Application unmounting");
    };
  }, []);

  // Wait for MSAL to initialize
  if (!msalInstance) {
    return <div className="flex h-screen items-center justify-center">Initializing authentication...</div>;
  }

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MsalProvider instance={msalInstance}>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <CookieConsent />
                <BrowserRouter>
                  <ScrollToTop />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<><Navigation /><PageLayout><Landing /></PageLayout><Footer /></>} />
                      <Route path="/services" element={<><Navigation /><PageLayout><Services /></PageLayout><Footer /></>} />
                      <Route path="/pricing" element={<><Navigation /><PageLayout><Pricing /></PageLayout><Footer /></>} />
                      <Route path="/privacy-policy" element={<><Navigation /><PageLayout><PrivacyPolicy /></PageLayout><Footer /></>} />
                      <Route path="/cookie-policy" element={<><Navigation /><PageLayout><CookiePolicy /></PageLayout><Footer /></>} />
                      <Route path="/terms-of-service" element={<><Navigation /><PageLayout><TermsOfService /></PageLayout><Footer /></>} />

                      {/* Auth route */}
                      <Route path="/auth" element={<Auth />} />

                      {/* Protected routes */}
                      <Route path="/payment" element={<ProtectedRoute><Navigation /><PageLayout><Payment /></PageLayout><Footer /></ProtectedRoute>} />
                      <Route path="/dashboard" element={<ProtectedRoute><Navigation /><PageLayout><Dashboard /></PageLayout><Footer /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Navigation /><PageLayout><Settings /></PageLayout><Footer /></ProtectedRoute>} />
                      <Route path="/portfolio" element={<ProtectedRoute><Navigation /><PageLayout><Portfolio /></PageLayout><Footer /></ProtectedRoute>} />
                      <Route path="/spi-picks" element={<ProtectedRoute><Navigation /><PageLayout><SpiPicks /></PageLayout><Footer /></ProtectedRoute>} />

                      {/* Admin routes */}
                      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                        <Route path="security" element={<Security />} />
                        <Route path="settings" element={<AdminSettings />} />
                      </Route>

                      {/* Catch-all */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </MsalProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
