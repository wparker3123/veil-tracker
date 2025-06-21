import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {VeilText, VeilTextInput} from "@/components/VeilText";

export default function SignInScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');

    const onSubmit = () => {
        if (pin.length === 6) router.replace('/main');
    };

    return (
        <SafeAreaView style={styles.container}>
            <VeilText style={styles.title}>Welcome{'\n'}to{'\n'}Veil</VeilText>

            <View style={styles.card}>
                <VeilText style={styles.label}>Choose a 6-Digit PIN</VeilText>
                <VeilTextInput
                    style={styles.input}
                    placeholder="Pin"
                    placeholderTextColor="#AAA"
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={6}
                    value={pin}
                    onChangeText={setPin}
                />

                <TouchableOpacity
                    style={[styles.button, pin.length < 6 && styles.buttonDisabled]}
                    onPress={onSubmit}
                    disabled={pin.length < 6}
                >
                    <VeilText style={styles.buttonText}>Submit</VeilText>
                </TouchableOpacity>
            </View>

            <VeilText style={styles.footer}>
                All sensitive data is stored locally on your device. Please choose a unique PIN to
                protect your data from prying eyes.
            </VeilText>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        color: '#f2a9a5',
        fontSize: 56,
        textAlign: 'center',
        lineHeight: 64,
        fontFamily: 'MonaspaceRadonWide',
        marginBottom: 40,
    },
    card: {
        backgroundColor: '#faf9f6',
        borderRadius: 16,
        padding: 24,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontFamily: 'MonaspaceRadonWide',
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 18,
        color: '#333',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#f2a9a5',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    footer: {
        color: '#888',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
        lineHeight: 18,
    },
});
