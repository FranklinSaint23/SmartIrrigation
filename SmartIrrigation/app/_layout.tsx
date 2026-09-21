import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { SmartIrrigationProvider } from '@/context/SmartIrrigationContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SmartIrrigationProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="device-status" />
          <Stack.Screen name="predictions" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="profile" />
          
          {/* Farmers breakdown workflows */}
          <Stack.Screen name="report-issue" />
          <Stack.Screen name="my-reports" />
          
          {/* Admin Management console */}
          <Stack.Screen name="admin-dashboard" />
          <Stack.Screen name="admin-farmers" />
          <Stack.Screen name="admin-farmer-detail" />
          <Stack.Screen name="admin-technicians" />
          <Stack.Screen name="admin-add-technician" />
          <Stack.Screen name="admin-devices" />
          <Stack.Screen name="admin-interventions" />
          <Stack.Screen name="admin-assign-technician" />
          <Stack.Screen name="admin-statistics" />
          
          {/* Tech Management console */}
          <Stack.Screen name="tech-dashboard" />
          <Stack.Screen name="tech-interventions" />
          <Stack.Screen name="tech-intervention-detail" />
          <Stack.Screen name="tech-diagnostic" />
          <Stack.Screen name="tech-close-intervention" />
        </Stack>
      </ThemeProvider>
    </SmartIrrigationProvider>
  );
}
