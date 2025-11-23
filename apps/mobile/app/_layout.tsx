import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { I18nextProvider } from "react-i18next";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/i18n';
import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { env } from '@/lib/env';

// set the host and the port property to connect to the emulator
// set these before any read/write operations occur to ensure it doesn't affect your Cloud Firestore data!
if (env.EXPO_PUBLIC_API_BASE_URL.includes('127.0.0.1')) {
  auth().useEmulator('http://127.0.0.1:4000')
}
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </I18nextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
