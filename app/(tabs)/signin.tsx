import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function SignInScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');

    const onSubmit = () => {
        // validate pin…
        router.replace('/main');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Veil</Text>
            <View style={styles.form}>
                <TextInput
                    placeholder="Choose a 6-Digit PIN"
                    keyboardType="number-pad"
                    maxLength={6}
                    style={styles.input}
                    value={pin}
                    onChangeText={setPin}
                />
                <Button title="Submit" onPress={onSubmit} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#000', justifyContent: 'center' },
    title:    { fontSize: 32, color: '#f2a9a5', textAlign: 'center', marginBottom: 40 },
    form:     { backgroundColor: '#111', padding: 20, borderRadius: 8 },
    input:    {
        backgroundColor: '#222',
        color: '#fff',
        padding: 10,
        marginBottom: 20,
        borderRadius: 4,
    },
});
