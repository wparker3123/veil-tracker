import { useRouter } from 'expo-router';
import React, {useEffect, useState, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {ActivityIndicator, Portal} from 'react-native-paper';
import {Calendar, CalendarActiveDateRange, CalendarTheme, toDateId} from "@marceloterreiro/flash-calendar";
import dayjs, {Dayjs} from 'dayjs';
import { MaterialIcons } from '@expo/vector-icons';
import { VeilText } from '@/components/VeilText';
import { veilColors, veilFonts, veilSpacing } from '@/styles/VeilStyles';
import { useSQLiteContext } from "expo-sqlite";
import {getVeilData, TrackerEntry} from "@/utils/db";
import {getDateRangesFromArray} from "@/utils/date";
import {StarsBackground} from '@/components/StarsBackground';


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
    const [loading, setLoading] = useState(true);
    const [veilData, setVeilData] = useState<TrackerEntry[]>([]);
    const [userTrackedCycle, setUserTrackedCycle] = useState<CalendarActiveDateRange[]>([]);
    const [predictedCycle, setPredictedCycle] = useState<CalendarActiveDateRange>({});
    const [daysUntil, setDaysUntil] = useState(-1);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getVeilData(db);
                setVeilData(data);
                console.log('data', data);

                if (data.length > 0) {
                    const userInputtedDates = data.map(entry => entry.date);
                    const dateRanges = getDateRangesFromArray(userInputtedDates)
                    setUserTrackedCycle(dateRanges);

                    if (!dateRanges.length) {
                        return;
                    }

                    calculatePredictedCycle(dateRanges);
                }
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        }

        fetchData();
    }, [db]);

    const isPredictedRange = (date: Date) => {
        if (dayjs().isSame(date, 'day')) {
            const entryForToday = veilData.find((entry) => entry.date === dayjs(date).format('YYYY-MM-DD'));
            return !!entryForToday;
        }
        return dayjs().isBefore(date, 'day');
    }

    const flashTheme = useMemo<CalendarTheme>(() => ({
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
            idle: ({isWeekend, isPressed}) => ({
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
            active: ({isStartOfRange, isEndOfRange, isDisabled, date}) => ({
                container: {
                    backgroundColor: isPredictedRange(date) ? 'transparent' : veilColors.accent,
                    borderTopLeftRadius: isStartOfRange ? 4 : 0,
                    borderBottomLeftRadius: isStartOfRange ? 4 : 0,
                    borderTopRightRadius: isEndOfRange ? 4 : 0,
                    borderBottomRightRadius: isEndOfRange ? 4 : 0,
                    borderColor: veilColors.accent,
                    borderStyle: 'dashed',
                    borderWidth: isPredictedRange(date) ? 2 : 0,
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
    }), []);


    const calculatePredictedCycle = (allDateRanges: CalendarActiveDateRange[]) => {
        let avgCycleLength = 28;
        let avgPeriodLength = 5;
        const lastTrackedCycle: CalendarActiveDateRange | undefined = allDateRanges.at(-1);
        const today = dayjs();
        const pastDateRanges = allDateRanges.filter((dateRange) => {
            const startDate = dayjs(dateRange.startId);
            const endDate = dayjs(dateRange.endId);

            return !today.isSame(startDate, 'week')
                && !today.isSame(startDate, 'day')
                && !today.isSame(endDate, 'week')
                && !today.isSame(endDate, 'day');
        });

        if (pastDateRanges.length > 1) {
            const cycleLengths = pastDateRanges
                .slice(1)
                .map((r, i) =>
                    dayjs(r.startId).diff(pastDateRanges[i].startId, 'day')
                );
            const periodLengths = pastDateRanges.map(r =>
                dayjs(r.endId).diff(r.startId, 'day') + 1
            );

            //Exponential smoothing parameters
            const alphaCycle = 0.3;
            const alphaPeriod = 0.35;

            let smoothedCycle = cycleLengths[0];
            for (let i = 1; i < cycleLengths.length; i++) {
                smoothedCycle =
                    alphaCycle * cycleLengths[i] +
                    (1 - alphaCycle) * smoothedCycle;
            }

            let smoothedPeriod = periodLengths[0];
            for (let i = 1; i < periodLengths.length; i++) {
                smoothedPeriod =
                    alphaPeriod * periodLengths[i] +
                    (1 - alphaPeriod) * smoothedPeriod;
            }

            avgCycleLength = Math.round(smoothedCycle);
            avgPeriodLength = Math.round(smoothedPeriod);
        }

        console.log("avg cycle: ", avgCycleLength);

        let predictedStartDate = dayjs(pastDateRanges.at(-1)?.startId); // start at last period start
        console.log(lastTrackedCycle);

        while (today.isAfter(predictedStartDate, 'day')) { // should only reach if user hasn't provided accurate data recently
            predictedStartDate = predictedStartDate.add(avgCycleLength, 'day');
        }
        if (predictedStartDate.isAfter(lastTrackedCycle?.startId, 'day') && predictedStartDate.isSame(lastTrackedCycle?.startId, 'week')) {
            console.log("in here")
            predictedStartDate = dayjs(lastTrackedCycle?.startId).add(avgCycleLength, 'day');
        }

        const predictedStart = predictedStartDate.format('YYYY-MM-DD');
        const predictedEnd = dayjs(predictedStart)
            .add(avgPeriodLength - 1, 'day')
            .format('YYYY-MM-DD');


        if (predictedStart && predictedEnd) {
            setPredictedDays(predictedStart, predictedEnd, avgCycleLength);
        }
    }

    const setPredictedDays = (predictedStart: string, predictedEnd: string, avgCycleLength: number) => {
        const diffInDays = Math.ceil(
            dayjs(predictedStart).diff(dayjs(), 'day', true)
        );
        if (diffInDays < 0) {
            setDaysUntil(diffInDays + avgCycleLength);
        } else {
            setDaysUntil(diffInDays);
            setPredictedCycle({
                startId: predictedStart,
                endId: predictedEnd,
            });
        }
    }


    return (
        <View style={styles.container}>
            <StarsBackground/>
            <VeilText variant="titleLarge" style={styles.headingText}>
                {daysUntil === 0 ? "next cycle is:" : "next cycle in:"}
            </VeilText>
            <VeilText variant="titleLarge" style={styles.countdownText}>
                {daysUntil !== -1 ? daysUntil === 0 ? "Today" : daysUntil + " days" : "--"}
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
                    onCalendarDayPress={(dateId) => {
                        if (disabledDates.includes(dateId)) {
                            return;
                        }
                        router.push({
                            pathname: '/day-details',
                            params: {selected_date: dateId},
                        })
                    }}
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

            <Portal>
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator animating size="large"/>
                    </View>
                )}
            </Portal>
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
        zIndex: 10
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,           // fill entire screen
        backgroundColor: 'rgba(0,0,0,0.4)',         // semi-transparent backdrop
        alignItems: 'center',
        justifyContent: 'center',
    }
});
