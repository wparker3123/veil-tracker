import { useRouter } from 'expo-router';
import React from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
} from 'react-native';

export default function DayDetailsScreen() {
    const router = useRouter();
    const { date } = "2025-07-18"; // e.g. ?date=2025-07-18

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>July</Text>
            <View style={styles.dateRow}>
                <Text style={styles.dateItem}>30</Text>
                <Text style={styles.dateItem}>1</Text>
                {/* … */}
            </View>

            <Text style={styles.label}>Flow Intensity</Text>
            <View style={styles.inputPlaceholder}>
                <Text>[Slider/Icon]</Text>
            </View>

            <Text style={styles.label}>Symptoms</Text>
            <View style={styles.inputPlaceholder}>
                <Text>[Slider/Icon]</Text>
            </View>

            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={[styles.input, { height: 120 }]}
                multiline
                defaultValue=""
            />

            <Button title="Update" onPress={() => router.back()} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    header:    {
        color:        '#f2a9a5',
        fontSize:     24,
        marginBottom: 10,
        textAlign:    'center',
    },
    dateRow:    {
        flexDirection:   'row',
        justifyContent: 'space-between',
        marginBottom:   20,
    },
    dateItem:    {
        color:         '#fff',
        padding:       10,
        backgroundColor: '#111',
        borderRadius:  4,
    },
    label:               { color: '#fff', marginTop: 15 },
    inputPlaceholder: {
        backgroundColor: '#111',
        padding:         15,
        borderRadius:    4,
        marginTop:       5,
        alignItems:      'center',
    },
    input: {
        backgroundColor: '#111',
        color:           '#fff',
        padding:         10,
        borderRadius:    4,
        marginTop:       5,
    },
});
