// Dynamic Expo config — reads secrets from environment variables at build time.
// Never hardcode tokens here. Store them in .env (gitignored).
export default ({ config }) => ({
  ...config,
  name: 'Coast',
  slug: 'Coast',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'coast',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#EDECEA',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.anonymous.Coast',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
    ],
    package: 'com.anonymous.Coast',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      '@rnmapbox/maps',
      {
        // Secret download token — set MAPBOX_DOWNLOAD_TOKEN in .env (never commit it)
        RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN ?? '',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission: 'Coast uses your location to show your position on the route.',
        locationAlwaysPermission: 'Coast uses your location in the background to keep navigation active.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
