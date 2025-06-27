import { useRouter } from 'expo-router';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity, Platform} from 'react-native';
import {VeilText, VeilTextInput} from "@/components/VeilText";
import { veilColors, veilFonts, veilSpacing } from '@/styles/VeilStyles';
import {HelperText, MD3DarkTheme as DarkTheme} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import {StarsBackground} from "@/components/StarsBackground";

async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, String(value));
}

async function getPin() {
    return await SecureStore.getItemAsync("veil-pin");
}



export default function SignInScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [firstTimeUser, setFirstTimeUser] = useState(false);
    const [displayed, setDisplayed] = useState('');

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const showWelcomeMessage = (fullText: string) => {
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
    }
    useEffect(() => {
        if (Platform.OS !== 'web') {
            getPin().then((veilPin) => {
                if (!veilPin) {
                    setFirstTimeUser(true);
                    showWelcomeMessage("welcome to veil");
                } else {
                    showWelcomeMessage('welcome back to veil');
                }
            });
        } else {
            setFirstTimeUser(true);
            showWelcomeMessage("welcome to veil");
        }
    }, []);

    const onSubmit = () => {
        if (Platform.OS === 'web') {
            router.replace('/main');
            return;
        }

        if (firstTimeUser) {
            save('veil-pin', pin);
            router.replace('/main');
        } else {
            getPin().then((veilPin) => {
                if (pin === veilPin) {
                    router.replace('/main');
                } else {
                    setIsError(true);
                    setErrorMessage("Wrong pin entered.");
                }
            })
        }
    };

    const validateAndSetConfirmPin = (enteredPin: string) => {
        setConfirmPin(enteredPin);

        if (enteredPin.length === 4 && enteredPin !== pin) {
            setIsError(true);
            setErrorMessage('PINs do not match');
        } else {
            setErrorMessage('');
            setIsError(false);
        }
    };

    const handlePinChange = (enteredPin: string) => {
        setPin(enteredPin);

        if (isError && !firstTimeUser) {
            setErrorMessage('');
            setIsError(false);
        }
    }

    const isButtonDisabled = firstTimeUser
        ? pin !== confirmPin || pin.length < 4 || confirmPin.length < 4
        : pin.length < 4;

    return (
        <View style={styles.container}>
            <VeilText variant="titleLarge" style={styles.header}>
                {displayed}
            </VeilText>

            <View style={styles.card}>
                <VeilTextInput
                    label={!firstTimeUser ? "4-digit PIN" : "Enter 4-digit PIN"}
                    mode="flat"
                    secureTextEntry={true}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={pin}
                    onChangeText={pin => {
                        handlePinChange(pin)
                    }}
                    underlineColor="#444"
                    activeUnderlineColor="#e8b4ac"
                    style={styles.input}
                    theme={{
                        fonts: {bodyLarge: {...DarkTheme.fonts.bodyLarge, fontFamily: "MonaspaceRadonWideExtraLight"}},
                    }}
                />
                {firstTimeUser && <VeilTextInput
                    label="Confirm PIN"
                    mode="flat"
                    secureTextEntry={true}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={confirmPin}
                    onChangeText={pin => validateAndSetConfirmPin(pin)}
                    underlineColor="#444"
                    activeUnderlineColor="#e8b4ac"
                    style={styles.input}
                    theme={{
                        fonts: {
                            bodyLarge: {
                                ...DarkTheme.fonts.bodyLarge,
                                fontFamily: "MonaspaceRadonWideExtraLight"
                            }
                        },
                    }}
                />}
                {isError &&
                    <HelperText type={'error'} visible>
                        {errorMessage}
                    </HelperText>
                }

                <TouchableOpacity
                    disabled={isButtonDisabled || isError}
                    onPress={onSubmit}
                    style={[
                        styles.button,
                        isButtonDisabled && {opacity: 0.5},
                    ]}
                >
                    <VeilText variant="bodyMedium" style={styles.buttonText}>
                        Submit
                    </VeilText>
                </TouchableOpacity>
            </View>

            {firstTimeUser && <VeilText variant="bodyMedium" style={styles.footer}>
                All sensitive data is stored locally on your device. Choose a unique PIN to protect your data from
                prying eyes.
            </VeilText>}

            {/*<StarsBackground/>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: veilSpacing.lg,
        gap: veilSpacing.xl,
        backgroundColor: veilColors.background,
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