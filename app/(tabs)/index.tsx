import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function TitleScreen() {
    const router = useRouter();

    useEffect(() => {
        const t = setTimeout(() => router.replace('/signin'), 2000);
        return () => clearTimeout(t);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Veil</Text>
            <ActivityIndicator size="large" color="#f2a9a5" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        fontSize: 48,
        color: '#f2a9a5',
        marginBottom: 20,
    },
});
