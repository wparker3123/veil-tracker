import { useRouter, useLocalSearchParams } from 'expo-router';
import dayjs, {Dayjs} from 'dayjs';
import React, {useEffect, useState} from 'react';
import Slider from '@react-native-community/slider';
import {SymptomsPicker} from "@/components/SymptomsPicker";
import {VeilText, VeilTextInput} from "@/components/VeilText";
import {veilColors, veilFonts, veilSpacing} from '@/styles/VeilStyles';
import {addDateEntry, deleteDateEntry, getDateEntry, TrackerEntry} from "@/utils/db";
import {useSQLiteContext} from "expo-sqlite";
import {
    Platform,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';

type Params = { selected_date: string };
type DayViewGroup = {
    dayOfMonth: number,
    date: Dayjs
}
const isDayViewSelectable = (selected_date: string, date: Dayjs) => {
    const selectedDate = dayjs(selected_date);
    const today = dayjs();
    if (today.isSame(selectedDate, 'day')) {
        return date.isBefore(selectedDate, 'day');
    }
    return date.isBefore(today, 'day') || date.isSame(today, 'day');
}

export default function DayDetailsScreen() {
    const router = useRouter();
    const {selected_date} = useLocalSearchParams<Params>();
    const [days, setDays] = useState<DayViewGroup[]>(Array);
    const [date, setDate] = useState(dayjs());
    const [existingData, setExistingData] = useState<TrackerEntry | null>();
    const db = useSQLiteContext();

    const [form, setForm] = useState({
        flowIntensity: 3,
        notes: '',
        symptoms: {},
    });

    const handleDelete = async () => {
        if (!selected_date) return;
        try {
            await deleteDateEntry(db, selected_date);
            router.back();
        } catch (err) {
            console.error("Failed to delete entry:", err);
        }
    };

    const handleUpdate = async () => {
        console.log(form.symptoms);
        await addDateEntry(db, selected_date, form.flowIntensity, JSON.stringify(form.symptoms), form.notes)
            .then(() => {
                console.log('Submitted form for ' + selected_date, form);
                router.back();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateForm = (key: keyof typeof form, value: any) => {
        setForm(prev => ({...prev, [key]: value}));
    };

    const getSevenDayView = (date: string): DayViewGroup[] => {
        const current = dayjs(date);

        return Array.from({length: 7}, (_, i) => {
                let currentDate = current.add(i - 3, 'day');
                console.log(currentDate);
                return {
                    dayOfMonth: currentDate.date(),
                    date: currentDate
                }
            }
        );
        // return daysInView;
    }

    useEffect(() => {
        if (!selected_date) {
            return;
        }
        const selectedDate = dayjs(selected_date);
        setDate(selectedDate);
        const iso = selectedDate.format("YYYY-MM-DD");
        setDays(getSevenDayView(iso));

        (async () => {
            try {
                const data = await getDateEntry(db, iso);
                setExistingData(data);

                if (data) {
                    setForm({
                        flowIntensity: data.flowLevel,
                        notes: data.notes,
                        symptoms: JSON.parse(data.symptoms),
                    })
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [db, selected_date]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <VeilText variant="titleLarge" style={styles.monthLabel}>
                {date.format('MMMM')}
            </VeilText>
            <View style={styles.dateRow}>
                {days.map((day) => (
                    <TouchableOpacity
                        key={day.dayOfMonth}
                        disabled={!isDayViewSelectable(selected_date, day.date)}
                        onPress={() => router.replace({
                            pathname: '/day-details',
                            params: {selected_date: day.date.format("YYYY-MM-DD")},
                        })}>
                        <VeilText
                            style={day.date.format("YYYY-MM-DD") !== selected_date ? styles.dateItem : [styles.dateItem, {backgroundColor: veilColors.accentSoft}]}
                        >
                            {day.dayOfMonth}
                        </VeilText>
                    </TouchableOpacity>
                ))}
            </View>

            <VeilText style={styles.sectionLabel}>Flow intensity</VeilText>
            {Platform.OS !== 'web' ? (
                <View style={styles.sliderBlock}>
                    <Slider
                        minimumValue={1}
                        maximumValue={5}
                        step={1}
                        value={form.flowIntensity}
                        onValueChange={value => updateForm('flowIntensity', value)}
                        minimumTrackTintColor={veilColors.accent}
                    />
                </View>
            ) : (
                <View style={styles.inputPlaceholder}>
                    <VeilText>[Slider/Icon]</VeilText>
                </View>
            )}

            <VeilText style={styles.sectionLabel}>Symptoms</VeilText>
            <SymptomsPicker
                symptoms={form.symptoms}
                toggleSymptom={(key: string) =>
                    updateForm('symptoms', {...form.symptoms, [key]: !form.symptoms[key]})
                }
            />

            <VeilText style={styles.sectionLabel}>Notes</VeilText>
            <VeilTextInput
                style={styles.input}
                multiline
                placeholder="Optional notes..."
                placeholderTextColor={veilColors.textSecondary}
                value={form.notes}
                onChangeText={text => updateForm('notes', text)}
            />

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <VeilText style={styles.updateButtonText}>Update</VeilText>
            </TouchableOpacity>
            {existingData && <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <VeilText variant="bodyLarge" style={styles.deleteButtonText}>
                    Delete
                </VeilText>
            </TouchableOpacity>}
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <VeilText style={styles.closeButtonText}>Close</VeilText>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: veilColors.background,
        paddingTop: 50
    },
    content: {
        padding: veilSpacing.lg,
    },
    monthLabel: {
        color: veilColors.accent,
        fontSize: 30,
        fontFamily: veilFonts.light,
        textAlign: 'center',
        textTransform: 'capitalize',
        marginBottom: veilSpacing.sm,
    },
    selectedDate: {
        color: veilColors.accentSoft,
        fontSize: 16,
        textAlign: 'center',
        fontFamily: veilFonts.regular,
        marginBottom: veilSpacing.lg,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
        marginBottom: veilSpacing.lg,
        alignItems: 'center',
    },
    dateItem: {
        color: veilColors.text,
        padding: veilSpacing.sm,
        backgroundColor: veilColors.surface,
        borderRadius: 8,
        fontFamily: veilFonts.regular,
        fontSize: 20,
        textAlign: 'center',
        minWidth: 30,
    },
    sectionLabel: {
        fontFamily: veilFonts.medium,
        fontSize: 14,
        color: veilColors.text,
        marginBottom: veilSpacing.xs,
        marginTop: veilSpacing.lg,
    },
    sliderBlock: {
        marginBottom: veilSpacing.md,
    },
    flowValue: {
        color: veilColors.text,
        fontFamily: veilFonts.regular,
        marginBottom: veilSpacing.xs,
        textAlign: 'center',
    },
    input: {
        backgroundColor: veilColors.surface,
        color: veilColors.text,
        fontFamily: veilFonts.regular,
        padding: veilSpacing.md,
        borderRadius: 8,
        minHeight: 120,
        textAlignVertical: 'top',
        marginBottom: veilSpacing.xl,
    },
    inputPlaceholder: {
        backgroundColor: veilColors.surface,
        padding: veilSpacing.md,
        borderRadius: 8,
        marginTop: veilSpacing.sm,
        alignItems: 'center',
    },
    updateButton: {
        backgroundColor: veilColors.accent,
        paddingVertical: veilSpacing.md,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        elevation: 2,
        marginBottom: veilSpacing.xl,
    },
    updateButtonText: {
        color: veilColors.background,
        fontFamily: veilFonts.medium,
        fontSize: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    closeButton: {
        backgroundColor: veilColors.accentSoft,
        paddingVertical: veilSpacing.md,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        elevation: 2,
        marginBottom: veilSpacing.xl,
        opacity: .8
    },
    closeButtonText: {
        color: veilColors.text,
        fontFamily: veilFonts.medium,
        fontSize: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    deleteButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: veilColors.accent,
        paddingVertical: veilSpacing.md,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: veilSpacing.xl,
    },
    deleteButtonText: {
        color: veilColors.accent,
        fontFamily: veilFonts.medium,
        fontSize: 14,
        letterSpacing: 1,
        textTransform: "uppercase",
    },
});
