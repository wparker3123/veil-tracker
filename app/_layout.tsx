import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Asset } from 'expo-asset';
import {useState, useEffect} from "react";
import initDB from '@/utils/db';
import {SQLiteProvider} from "expo-sqlite";
import {veilColors} from '@/styles/VeilStyles';
import {Provider as PaperProvider, MD3DarkTheme as DarkTheme} from 'react-native-paper';

const theme = {
    ...DarkTheme,
    dark: true,
    roundness: 12,
    colors: {
        ...DarkTheme.colors,
        primary: veilColors.accent,
        background: veilColors.background,
        surface: veilColors.surface,
        text: veilColors.text,
        placeholder: '#AAA', // consider adding to veilColors if reused
        outline: veilColors.outline,
    },
};

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const [ready, setReady] = useState(false);
    const colorScheme = useColorScheme();
    const [fontsLoaded] = useFonts({
        'MonaspaceRadonWide': require('../assets/fonts/MonaspaceRadon-WideRegular.otf'),
        'MonaspaceRadonWideBold': require('../assets/fonts/MonaspaceRadon-WideBold.otf'),
        'MonaspaceRadonWideSemiBold': require('../assets/fonts/MonaspaceRadon-WideSemiBold.otf'),
        'MonaspaceRadonWideItalic': require('../assets/fonts/MonaspaceRadon-WideItalic.otf'),
        'MonaspaceRadonWideMedium': require('../assets/fonts/MonaspaceRadon-WideMedium.otf'),
        'MonaspaceRadonWideLight': require('../assets/fonts/MonaspaceRadon-WideLight.otf'),
        'MonaspaceRadonWideExtraLight': require('../assets/fonts/MonaspaceRadon-WideExtraLight.otf'),
    });

    useEffect(() => {
        async function prepare() {
            if (!fontsLoaded) return;

            await Asset.loadAsync(require('../assets/images/logos/veil_logo.png'));

            await SplashScreen.hideAsync();
            setReady(true);
        }
        prepare();
    }, [fontsLoaded]);

    if (!ready) {
        return null;  // keep splash up
    }

  return (
      <PaperProvider theme={theme}>
          <SQLiteProvider databaseName={'veil.db'} onInit={initDB}>
              <Stack>
                  <Stack.Screen name="(screens)" options={{headerShown: false}}/>
                  <Stack.Screen name="+not-found"/>
              </Stack>
              <StatusBar style="auto"/>
          </SQLiteProvider>
      </PaperProvider>
  );
}
