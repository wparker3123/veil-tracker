import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {Image} from "expo-image";

export default function TitleScreen() {
    const router = useRouter();

    useEffect(() => {
        const t = setTimeout(() => router.replace('/signin'), 4000);
        return () => clearTimeout(t);
    }, []);

    return (
        <View style={styles.container}>
            {/*<Text style={styles.logo}>Veil</Text>*/}
            <Image
                source={require('../../assets/images/logos/veil_logo.png')}
                style={styles.logoImage}
            ></Image>
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
    logoImage: {
        width: 240,
        height: 240,
        alignSelf: 'center',
        marginBottom: 20,
    }
});
