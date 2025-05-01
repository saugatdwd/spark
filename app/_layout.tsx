import { AxiosClient } from '@/packages/core/api-client';
import { ApiClientProvider } from '@/packages/core';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Playfair-Regular': PlayfairDisplay_400Regular,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });

  // Hide splash screen once fonts are loaded and framework is ready
  useEffect(() => {
    console.log('Fonts:', fontsLoaded, 'Error:', fontError, 'Ready:');
    if ((fontsLoaded || fontError) ) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  

  // Return null to keep splash screen visible while loading
  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApiClientProvider client={AxiosClient}>
      {/* <AuthProvider> */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="+not-found" options={{ animation: 'slide_from_right' }} />
        </Stack>
        <StatusBar style="auto" />
      {/* </AuthProvider> */}
      </ApiClientProvider>
    </GestureHandlerRootView>
  );
}