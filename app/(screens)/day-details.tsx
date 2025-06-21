import { useRouter, useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import Slider from '@react-native-community/slider';
import { Platform } from 'react-native';
import {SymptomsPicker} from "@/components/SymptomsPicker";
import {VeilText} from "@/components/VeilText";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
} from 'react-native';


export default function DayDetailsScreen() {
    const router = useRouter();
    const { selected_date } = useLocalSearchParams();
    const [flowIntensity, setFlowIntensity] = useState(3);
    const [days, setDays] = useState(Array);
    const [date, setDate] = useState(dayjs())
    const [symptoms, setSymptoms] = useState<Record<string, boolean>>({});

    const toggleSymptom = (key: string) =>
        setSymptoms(prev => ({ ...prev, [key]: !prev[key] }));

    const getSevenDayView = (date: string) => {
        const current = dayjs(date);
        console.log("hello");
        return Array.from({ length: 7 }, (_, i) =>
            current.add(i - 3, 'day').date()
        );
    }

    useEffect(() => {
        setDays(getSevenDayView(String (selected_date)));
        if (selected_date) {
            setDate(dayjs(String(selected_date)));
        }
    }, [selected_date]);

    return (
        <ScrollView style={styles.container}>
            <VeilText style={styles.header}>{date.format('MMMM')}</VeilText>
            <View style={styles.dateRow}>
                {days.map((day) => (
                    <VeilText key={day} style={styles.dateItem}>
                        {day}
                    </VeilText>
                ))}
            </View>
            <VeilText style={styles.header}>{selected_date}</VeilText>
            <VeilText style={styles.label}>Flow Intensity</VeilText>
            {
                Platform.OS !== 'web' ?
                    <View>
                        <VeilText>{flowIntensity}</VeilText>
                        <Slider
                            minimumValue={1}
                            maximumValue={5}
                            step={1}
                            value={flowIntensity}
                            onValueChange={value => setFlowIntensity(value)}
                            minimumTrackTintColor={'#f2a9a5'}
                        />
                    </View> :
                    <View style={styles.inputPlaceholder}>
                        <VeilText>[Slider/Icon]</VeilText>
                    </View>
            }

            <VeilText style={styles.label}>Symptoms</VeilText>
            <SymptomsPicker
                symptoms={symptoms}
                toggleSymptom={toggleSymptom}
            />

            <VeilText style={styles.label}>Notes</VeilText>
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
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        padding: 20
    },
    header: {
        paddingTop: 30,
        color: '#f2a9a5',
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: "MonaSpaceRadonWide"
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dateItem: {
        color: '#fff',
        padding: 10,
        backgroundColor: '#111',
        borderRadius: 4,
    },
    label: {color: '#fff', marginTop: 15},
    inputPlaceholder: {
        backgroundColor: '#111',
        padding: 15,
        borderRadius: 4,
        marginTop: 5,
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#111',
        color: '#fff',
        padding: 10,
        borderRadius: 4,
        marginTop: 5,
    },
});
