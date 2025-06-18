import { useRouter, useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
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
    const { selected_date } = useLocalSearchParams();

    const getSevenDayView = (date: string) => {
        const current = dayjs(date);
        return Array.from({ length: 7 }, (_, i) =>
            current.add(i - 3, 'day').date()
        );
    }
    const date = selected_date ? dayjs(String(selected_date)) : dayjs();
    console.log(date);
    const days = getSevenDayView(String (selected_date));
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{date.format('MMMM')}</Text>
            <View style={styles.dateRow}>
                {days.map((day) => (
                    <Text key={day} style={styles.dateItem}>
                        {day}
                    </Text>
                ))}
            </View>
            <Text style={styles.header}>{selected_date}</Text>
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
