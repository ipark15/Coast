import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="comfort" />
      <Stack.Screen name="route-summary" />
      <Stack.Screen name="map" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="ride" />
    </Stack>
  );
}
