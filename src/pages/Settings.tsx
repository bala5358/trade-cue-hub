import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, User, Lock, Globe } from "lucide-react";
import { settingsService, authService } from "@/services";
import type { UserSettings, UpdateSettingsRequest } from "@/types/settings.types";
import type { UserProfile, UpdateProfileRequest } from "@/types/auth.types";
import { useToast } from "@/hooks/use-toast";
import { updateProfileSchema } from "@/lib/validations/auth.validation";
import { z } from "zod";
import { SEO } from "@/components/SEO";

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, settingsData] = await Promise.all([
          authService.getProfile(),
          settingsService.getSettings(),
        ]);
        setProfile(profileData);
        setSettings(settingsData);
        setFirstName(profileData.firstName);
        setLastName(profileData.lastName);
        setPhone(profileData.phone || "");
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Validate profile data
      const validated = updateProfileSchema.parse({
        firstName,
        lastName,
        phone: phone || undefined,
      });
      
      const data: UpdateProfileRequest = {
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone,
      };
      
      await authService.updateProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        console.error('Failed to update profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSettings = async (updates: UpdateSettingsRequest) => {
    try {
      const response = await settingsService.updateSettings(updates);
      setSettings(response.settings);
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-32 bg-muted rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Settings"
        description="Manage your account settings, profile information, and notification preferences."
        keywords="account settings, user profile, notifications, preferences"
        noindex={true}
      />
      <div className="min-h-screen py-8" role="main" aria-label="Settings">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Settings */}
          <Card className="p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground">
                Update your personal information
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profile?.email || ""} 
                disabled 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+91 98765 43210" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
              />
            </div>

            <Button variant="hero" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Configure how you receive trading alerts
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive instant alerts on your device
                </p>
              </div>
              <Switch 
                checked={settings?.pushNotifications || false}
                onCheckedChange={(checked) => handleUpdateSettings({ pushNotifications: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get trading signals via email
                </p>
              </div>
              <Switch 
                checked={settings?.emailNotifications || false}
                onCheckedChange={(checked) => handleUpdateSettings({ emailNotifications: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive text messages for critical signals
                </p>
              </div>
              <Switch 
                checked={settings?.smsAlerts || false}
                onCheckedChange={(checked) => handleUpdateSettings({ smsAlerts: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekend Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get market preparation alerts on weekends
                </p>
              </div>
              <Switch 
                checked={settings?.weekendNotifications || false}
                onCheckedChange={(checked) => handleUpdateSettings({ weekendNotifications: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Market Preferences */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Market Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Choose your active markets and segments
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>India Market (NSE/BSE)</Label>
                <p className="text-sm text-muted-foreground">
                  Enable notifications for Indian stocks
                </p>
              </div>
              <Switch 
                checked={settings?.indiaMarketEnabled || false}
                onCheckedChange={(checked) => handleUpdateSettings({ indiaMarketEnabled: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>US Market (NYSE/NASDAQ)</Label>
                <p className="text-sm text-muted-foreground">
                  Enable notifications for US stocks
                </p>
              </div>
              <Switch 
                checked={settings?.usMarketEnabled || false}
                onCheckedChange={(checked) => handleUpdateSettings({ usMarketEnabled: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full md:w-auto">
              Change Password
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              Enable Two-Factor Authentication
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 shadow-card border-destructive/20">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-1">
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground">
                Irreversible actions for your account
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                Cancel Subscription
              </Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Settings;
