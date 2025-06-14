import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MainScreen() {
    const router = useRouter();
    const daysUntil = 5; // placeholder

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Next Cycle in: {daysUntil} days</Text>

            <View style={styles.calendarPlaceholder}>
                <Text style={{ color: '#888' }}>[Calendar here]</Text>
            </View>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/quick-track')}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:           { flex: 1, backgroundColor: '#000', padding: 20 },
    header:              { color: '#f2a9a5', fontSize: 24, marginBottom: 20 },
    calendarPlaceholder: {
        flex: 1,
        backgroundColor: '#111',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        right:    30,
        bottom:   30,
        backgroundColor: '#f2a9a5',
        width:    60,
        height:   60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: { fontSize: 32, color: '#000' },
});
