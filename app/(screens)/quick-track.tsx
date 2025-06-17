import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function QuickTrackScreen() {
    const router = useRouter();
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [intensity, setIntensity] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [notes, setNotes] = useState('');

    const onSubmit = () => {
        // save entry…
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Date</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} />

            <Text style={styles.label}>Flow Intensity</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 1–5"
                value={intensity}
                onChangeText={setIntensity}
            />

            <Text style={styles.label}>Symptoms</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. cramps"
                value={symptoms}
                onChangeText={setSymptoms}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                multiline
                value={notes}
                onChangeText={setNotes}
            />

            <Button title="Submit" onPress={onSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    label:     { color: '#fff', marginTop: 15 },
    input:     {
        backgroundColor: '#111',
        color: '#fff',
        padding: 10,
        borderRadius: 4,
        marginTop: 5,
    },
});
