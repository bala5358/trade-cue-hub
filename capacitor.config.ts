import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.47c56af952cc47fd938a7882595fd542',
  appName: 'trade-cue-hub',
  webDir: 'dist',
  server: {
    url: 'https://47c56af9-52cc-47fd-938a-7882595fd542.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
