import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { 
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold 
} from '@expo-google-fonts/plus-jakarta-sans';

import AppTabs from '@/components/app-tabs';
import { TripProvider } from '@/context/TripContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!isAuthenticated && !inAuthGroup) {
      // Wait for layout to mount before pushing
      setTimeout(() => {
        router.replace('/login');
      }, 0);
    } else if (isAuthenticated && inAuthGroup) {
      setTimeout(() => {
        router.replace('/');
      }, 0);
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) return null;

  return <AppTabs />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <TripProvider>
          <RootLayoutNav />
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
