import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Asset } from 'expo-asset';
import {useState, useEffect} from "react";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const [ready, setReady] = useState(false);
    const colorScheme = useColorScheme();
    const [fontsLoaded] = useFonts({
        'MonaspaceRadon': require('../assets/fonts/MonaspaceRadon-WideRegular.otf'),
    });

    useEffect(() => {
        async function prepare() {
            // wait for fonts
            if (!fontsLoaded) return;

            // preload logo
            await Asset.loadAsync(require('../assets/images/logos/veil_logo.png'));

            // now hide splash and render your app
            await SplashScreen.hideAsync();
            setReady(true);
        }
        prepare();
    }, [fontsLoaded]);

    if (!ready) {
        return null;  // keep splash up
    }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
