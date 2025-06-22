import { useRouter } from 'expo-router';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {VeilText, VeilTextInput} from "@/components/VeilText";
import { veilColors, veilFonts, veilSpacing } from '@/styles/VeilStyles';


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

export default function SignInScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [displayed, setDisplayed] = useState('');
    const fullText = 'welcome back to veil';

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i <= fullText.length) {
                setDisplayed(fullText.slice(0, i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 80);
        return () => clearInterval(interval);
    }, []);

    const onSubmit = () => {
        if (pin.length === 4) router.replace('/main');
    };

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.container}>
                <View style={styles.inner}>
                    <VeilText variant="titleLarge" style={styles.header}>
                        {displayed}
                    </VeilText>

                    <View style={styles.card}>
                        <VeilTextInput
                            label="4-digit PIN"
                            mode="flat"
                            secureTextEntry
                            keyboardType="number-pad"
                            maxLength={4}
                            value={pin}
                            onChangeText={setPin}
                            underlineColor="#444"
                            activeUnderlineColor="#e8b4ac"
                            style={styles.input}
                            theme={{
                                fonts: { bodyLarge: { ...DarkTheme.fonts.bodyLarge, fontFamily: "MonaspaceRadonWideExtraLight" } },
                            }}
                        />

                        <TouchableOpacity
                            disabled={pin.length < 4}
                            onPress={onSubmit}
                            style={[
                                styles.button,
                                pin.length < 4 && { opacity: 0.5 },
                            ]}
                        >
                            <VeilText variant="bodyMedium" style={styles.buttonText}>
                                Submit
                            </VeilText>
                        </TouchableOpacity>
                    </View>

                    <VeilText variant="bodyMedium" style={styles.footer}>
                        All sensitive data is stored locally on your device. Choose a unique PIN to protect your data from prying eyes.
                    </VeilText>
                </View>
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: veilColors.background,
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: veilSpacing.lg,
        gap: veilSpacing.xl,
    },
    header: {
        color: veilColors.accent,
        textAlign: 'center',
        fontSize: 20,
        letterSpacing: 1,
        opacity: 0.85,
        textTransform: 'lowercase',
        fontFamily: veilFonts.light,
    },
    card: {
        width: '100%',
        gap: veilSpacing.md,
        padding: veilSpacing.lg,
        backgroundColor: veilColors.surface,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    input: {
        backgroundColor: veilColors.surface,
        borderRadius: 8,
        paddingHorizontal: veilSpacing.md,
    },
    button: {
        backgroundColor: veilColors.accentSoft,
        borderRadius: 12,
        paddingVertical: veilSpacing.sm + 2,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    buttonText: {
        color: veilColors.background,
        fontFamily: veilFonts.medium,
    },
    footer: {
        color: veilColors.textSecondary,
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: veilSpacing.lg,
        marginTop: veilSpacing.sm + 4,
    },
});