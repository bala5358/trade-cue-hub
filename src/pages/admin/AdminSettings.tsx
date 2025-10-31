import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services';
import type { AdminSettingsResponse, UpdateAppSettingsRequest, UpdateEmailConfigRequest } from '@/types/admin.types';
import { appSettingsSchema, emailConfigSchema } from '@/lib/validations/admin.validation';
import { z } from 'zod';

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AdminSettingsResponse | null>(null);

  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [apiRateLimitingEnabled, setApiRateLimitingEnabled] = useState(false);

  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);

  const [azureEndpoint, setAzureEndpoint] = useState('');
  const [apiVersion, setApiVersion] = useState('');

  const [slackEnabled, setSlackEnabled] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await adminService.getSettings();
        setSettings(data);
        
        setAppName(data.appSettings.appName);
        setAppDescription(data.appSettings.appDescription);
        setMaintenanceMode(data.appSettings.maintenanceMode);
        setApiRateLimitingEnabled(data.appSettings.apiRateLimitingEnabled);
        
        setSmtpHost(data.emailConfig.smtpHost);
        setSmtpPort(data.emailConfig.smtpPort.toString());
        setFromEmail(data.emailConfig.fromEmail);
        setEmailNotificationsEnabled(data.emailConfig.emailNotificationsEnabled);
        
        setAzureEndpoint(data.apiConfig.azureEndpoint);
        setApiVersion(data.apiConfig.apiVersion);
        
        setSlackEnabled(data.notificationConfig.slackEnabled);
      } catch (error) {
        console.error('Failed to fetch admin settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSaveAppSettings = async () => {
    try {
      setSaving(true);
      
      // Validate app settings
      const validated = appSettingsSchema.parse({
        appName,
        appDescription,
        maintenanceMode,
        apiRateLimitingEnabled,
      });
      
      const data: UpdateAppSettingsRequest = {
        appName: validated.appName,
        appDescription: validated.appDescription,
        maintenanceMode: validated.maintenanceMode,
        apiRateLimitingEnabled: validated.apiRateLimitingEnabled,
      };
      
      await adminService.updateAppSettings(data);
      toast({
        title: 'Success',
        description: 'Application settings updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: 'Validation Error',
          description: firstError.message,
          variant: 'destructive',
        });
      } else {
        console.error('Failed to update app settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to update settings. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmailConfig = async () => {
    try {
      setSaving(true);
      
      // Validate email config
      const validated = emailConfigSchema.parse({
        smtpHost,
        smtpPort: parseInt(smtpPort),
        fromEmail,
        emailNotificationsEnabled,
      });
      
      const data: UpdateEmailConfigRequest = {
        smtpHost: validated.smtpHost,
        smtpPort: validated.smtpPort,
        fromEmail: validated.fromEmail,
        emailNotificationsEnabled: validated.emailNotificationsEnabled,
      };
      
      await adminService.updateEmailConfig(data);
      toast({
        title: 'Success',
        description: 'Email configuration updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: 'Validation Error',
          description: firstError.message,
          variant: 'destructive',
        });
      } else {
        console.error('Failed to update email config:', error);
        toast({
          title: 'Error',
          description: 'Failed to update email config. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">Configure application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic application configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="app-name">Application Name</Label>
            <Input 
              id="app-name" 
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="app-description">Description</Label>
            <Textarea 
              id="app-description" 
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
            </div>
            <Switch 
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>
          <Button onClick={handleSaveAppSettings} disabled={saving}>
            {saving ? 'Saving...' : 'Save General Settings'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>Configure email service settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="smtp-host">SMTP Host</Label>
            <Input 
              id="smtp-host" 
              placeholder="smtp.example.com"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-port">SMTP Port</Label>
            <Input 
              id="smtp-port" 
              type="number" 
              placeholder="587"
              value={smtpPort}
              onChange={(e) => setSmtpPort(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="from-email">From Email</Label>
            <Input 
              id="from-email" 
              type="email" 
              placeholder="noreply@example.com"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              maxLength={255}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
            </div>
            <Switch 
              checked={emailNotificationsEnabled}
              onCheckedChange={setEmailNotificationsEnabled}
            />
          </div>
          <Button onClick={handleSaveEmailConfig} disabled={saving}>
            {saving ? 'Saving...' : 'Save Email Configuration'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure external API integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="azure-endpoint">Azure Endpoint</Label>
            <Input 
              id="azure-endpoint" 
              placeholder="https://your-service.azure.com"
              value={azureEndpoint}
              onChange={(e) => setAzureEndpoint(e.target.value)}
              maxLength={2048}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-version">API Version</Label>
            <Input 
              id="api-version"
              value={apiVersion}
              onChange={(e) => setApiVersion(e.target.value)}
              maxLength={20}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable API Rate Limiting</Label>
              <p className="text-sm text-muted-foreground">Protect against excessive requests</p>
            </div>
            <Switch 
              checked={apiRateLimitingEnabled}
              onCheckedChange={setApiRateLimitingEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
            </div>
            <Switch 
              checked={emailNotificationsEnabled}
              onCheckedChange={setEmailNotificationsEnabled}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Slack Integration</Label>
              <p className="text-sm text-muted-foreground">Send notifications to Slack</p>
            </div>
            <Switch 
              checked={slackEnabled}
              onCheckedChange={setSlackEnabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;