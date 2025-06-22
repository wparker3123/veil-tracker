import { useRouter } from 'expo-router';
import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {Calendar, CalendarActiveDateRange, CalendarTheme, toDateId} from "@marceloterreiro/flash-calendar";
import dayjs from 'dayjs';
import { MaterialIcons } from '@expo/vector-icons';
import { VeilText } from '@/components/VeilText';
import { veilColors, veilFonts, veilSpacing } from '@/styles/VeilStyles';
import { useSQLiteContext } from "expo-sqlite";
import {getVeilData, TrackerEntry} from "@/utils/db";
import {getDateRangesFromArray} from "@/utils/date";

const flashTheme: CalendarTheme = {
    rowMonth: {
        content: {
            textAlign: 'center',
            color: veilColors.accent,
            fontFamily: veilFonts.regular,
        },
    },
    rowWeek: {
        container: {
            justifyContent: 'space-around',
            borderBottomWidth: 2,
            borderColor: veilColors.accent,
            borderStyle: 'dashed',
        },
    },
    itemWeekName: {
        content: {
            color: veilColors.text,
            fontFamily: veilFonts.regular,
        },
    },
    itemDayContainer: {
        activeDayFiller: {
            backgroundColor: 'transparent',
        },
    },
    itemDay: {
        idle: ({ isWeekend, isPressed }) => ({
            content: {
                color: isWeekend && !isPressed ? '#ffffff99' : veilColors.text,
                fontFamily: veilFonts.regular,
            },
        }),
        today: () => ({
            content: {
                color: veilColors.accent,
                fontFamily: veilFonts.regular,
            },
        }),
        active: ({ isStartOfRange, isEndOfRange, isDisabled, date }) => ({
            container: {
                backgroundColor: dayjs(date).isAfter(dayjs()) ? 'transparent' : veilColors.accent,
                borderTopLeftRadius: isStartOfRange ? 4 : 0,
                borderBottomLeftRadius: isStartOfRange ? 4 : 0,
                borderTopRightRadius: isEndOfRange ? 4 : 0,
                borderBottomRightRadius: isEndOfRange ? 4 : 0,
                borderColor: veilColors.accent,
                borderStyle: 'dashed',
                borderWidth: dayjs(date).isAfter(dayjs()) ? 2 : 0,
            },
            content: {
                color: isDisabled ? veilColors.disabledText : veilColors.text,
                opacity: isDisabled ? 0.2 : 1,
                fontFamily: veilFonts.regular,
            },
        }),
        disabled: () => ({
            content: {
                fontFamily: veilFonts.regular,
                color: veilColors.disabledText,
                opacity: 0.2,
            },
        }),
    },
};

const getDisabledDays = () => {
    const disabledDates = [];
    const today = dayjs();
    for (let i = 1; i <= 35; i++) {
        disabledDates.push(today.add(i, "day").format('YYYY-MM-DD'));
    }
    return disabledDates;
};

export default function MainScreen() {
    const router = useRouter();

    const disabledDates = getDisabledDays();
    const db = useSQLiteContext();
    const [veilData, setVeilData] = useState<TrackerEntry[]>([]);
    const [userTrackedCycle, setUserTrackedCycle] = useState<CalendarActiveDateRange[]>([]);
    const [predictedCycle, setPredictedCycle] = useState<CalendarActiveDateRange>({
        startId: '2025-07-05',
        endId: '2025-07-11',
    });
    const [daysUntil, setDaysUntil] = useState(0); // placeholder

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getVeilData(db);
                setVeilData(data); // Update state
            } catch (e) {
                console.error(e);
            }
        }
        fetchData();
    }, [db]);

    useEffect(() => {
        if (veilData.length > 0) {
            const userInputtedDates = veilData.map(entry => entry.date);
            setUserTrackedCycle(getDateRangesFromArray(userInputtedDates));
        }

        if (predictedCycle.startId && predictedCycle.endId) {
            const diffInDays = Math.ceil(dayjs(predictedCycle.startId).diff(dayjs(), 'day', true));
            if (diffInDays <= 0) {
                setDaysUntil(diffInDays + 28); //TODO: put actual logic if cycle is already started
            }
            else {
                setDaysUntil(diffInDays);
            }
        }
    }, [veilData]);


    return (
        <View style={styles.container}>
            <VeilText variant="titleLarge" style={styles.headingText}>
                next cycle in:
            </VeilText>
            <VeilText variant="titleLarge" style={styles.countdownText}>
                {daysUntil} days
            </VeilText>

            <View style={styles.calendarCard}>
                <Calendar.List
                    calendarDisabledDateIds={disabledDates}
                    calendarMaxDateId={disabledDates.at(-1)}
                    calendarDayHeight={32}
                    calendarActiveDateRanges={[
                        ...userTrackedCycle,
                        predictedCycle
                    ]}
                    calendarRowHorizontalSpacing={12}
                    calendarRowVerticalSpacing={12}
                    onCalendarDayPress={(day) =>
                        router.push({
                            pathname: '/day-details',
                            params: { selected_date: day },
                        })
                    }
                    theme={flashTheme}
                />
            </View>

            <TouchableOpacity
                style={styles.fab}
                onPress={() =>
                    router.push({
                    pathname: '/day-details',
                    params: {
                        selected_date: dayjs().format('YYYY-MM-DD'),
                    },
                })}
            >
                <MaterialIcons name="add" size={32} color="#faf9f6" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: veilColors.background,
        padding: veilSpacing.lg,
        paddingTop: 150,
        alignItems: 'center',
    },
    headingText: {
        color: veilColors.accent,
        fontSize: 20,
        letterSpacing: 1,
        textTransform: 'lowercase',
        opacity: 0.85,
        textAlign: 'center',
        fontFamily: veilFonts.medium,
        marginBottom: veilSpacing.xs / 2,
    },
    countdownText: {
        color: veilColors.accent,
        fontSize: 28,
        fontFamily: veilFonts.bold,
        marginBottom: veilSpacing.lg,
        textAlign: 'center',
    },
    calendarCard: {
        width: '100%',
        height: 400,
        marginTop: veilSpacing.xs,
        backgroundColor: veilColors.surface,
        borderRadius: 12,
        padding: veilSpacing.md,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    fab: {
        position: 'absolute',
        bottom: veilSpacing.xl,
        marginTop: veilSpacing.lg,
        backgroundColor: veilColors.accent,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
});
