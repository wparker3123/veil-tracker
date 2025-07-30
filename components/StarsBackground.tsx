import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';

export function StarsBackground() {
    if (Platform.OS === 'ios') return (
        <LottieView
            renderMode='SOFTWARE'
            source={require('@/assets/animations/stars.json')}
            autoPlay
            loop
            style={[styles.bg]}
        />
    );

    return (
        <View style={styles.view}>
            <LottieView
                renderMode='SOFTWARE'
                source={require('@/assets/animations/stars.json')}
                autoPlay
                loop
                style={styles.bg}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    bg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.75,
    },
    view: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: -1,
    }
});