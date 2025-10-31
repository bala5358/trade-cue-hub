import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setShowBanner(false);
    setShowCustomize(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <Cookie className="h-6 w-6 mt-1 flex-shrink-0 text-primary" />
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Cookie Consent</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleAcceptAll} size="sm" className="flex-1">
                Accept All
              </Button>
              <Button onClick={handleRejectAll} variant="outline" size="sm" className="flex-1">
                Reject All
              </Button>
              <Button 
                onClick={() => setShowCustomize(true)} 
                variant="ghost" 
                size="sm"
                className="flex-1"
              >
                Customize
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Read our{' '}
              <a href="/privacy-policy" className="underline hover:text-foreground">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/cookie-policy" className="underline hover:text-foreground">
                Cookie Policy
              </a>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={handleRejectAll}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Cookie Preferences</DialogTitle>
            <DialogDescription>
              Choose which cookies you want to allow. Necessary cookies are always enabled.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="necessary">Necessary Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Required for the website to function properly
                </p>
              </div>
              <Switch
                id="necessary"
                checked={preferences.necessary}
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analytics">Analytics Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="marketing">Marketing Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Used to deliver personalized advertisements
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketing: checked })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSavePreferences} className="flex-1">
              Save Preferences
            </Button>
            <Button onClick={handleRejectAll} variant="outline" className="flex-1">
              Reject All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
