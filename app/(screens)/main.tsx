import { useRouter } from 'expo-router';
import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
//import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Calendar, CalendarTheme, toDateId} from "@marceloterreiro/flash-calendar";
import dayjs from 'dayjs';
import { MaterialIcons } from '@expo/vector-icons';

const flashTheme: CalendarTheme = {
    // month header (“June 2025”)
    rowMonth: {
        content: {
            textAlign: "center",
            color: "#f2a9a5",
            fontFamily: "MonaspaceRadonWide",
        },
    },

    // weekday header (“S M T W…”)
    rowWeek: {
        container: {
            justifyContent: "space-around",
            borderBottomWidth: 2,
            borderColor: "#f2a9a5",
            borderStyle: "dashed",
        }
    },
    itemWeekName: {
        content: {
            color: "#faf9f6",
            fontFamily: "MonaspaceRadonWide",
        },
    },

    // each day cell
    itemDay: {
        // default (idle) days
        idle: ({ isWeekend, isPressed }) => ({
            content: {
                color: isWeekend && !isPressed ? "#ffffff99" : "#faf9f6",
                fontFamily: "MonaspaceRadonWide",
            },
        }),
        // today’s number
        today: () => ({
            content: {
                color: "#f2a9a5",
                fontFamily: "MonaspaceRadonWide",
            },
        }),
        // selected day
        active: () => ({
            content: {
                color: "#1A1A1A",
                fontFamily: "MonaspaceRadonWide",
            },
            container: {
                backgroundColor: "#f2a9a5",
            },
        }),
        disabled: () => ({
            content: {
                fontFamily: "MonaspaceRadonWide",
                color: "#ffffff99",
                opacity: .2
            }
        })
    },
};
const getDisabledDays = () => {
    const disabledDates = [];
    const today = dayjs();
    for (let i = 1; i <= 45; i++)  {
        disabledDates.push(today.add(i, "day").format('YYYY-MM-DD'));
    }
    return disabledDates;
}
export default function MainScreen() {
    const router = useRouter();
    const daysUntil = 5; // placeholder
    const today = toDateId(new Date());
    const disabledDates = getDisabledDays();

    return (
        <View style={styles.container}>
            <Text style={[styles.header, {color: '#faf9f6'}]}>Next Cycle in: </Text>
            <Text style={styles.header}>{daysUntil} days</Text>
            <View style={styles.calenderQuickView}>
                <Calendar.List
                    calendarDisabledDateIds={disabledDates}
                    calendarMaxDateId={disabledDates.at(-1)}
                    calendarDayHeight={32}
                    calendarRowHorizontalSpacing={12}
                    calendarRowVerticalSpacing={12}
                    onCalendarDayPress={(day) =>
                        router.push({
                            pathname: '/day-details',
                            params: {
                                selected_date: day,
                            }
                        })
                    }
                    theme={flashTheme}
                />
            </View>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/quick-track')}
            >
                <MaterialIcons name="add" size={32} color="#faf9f6" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        padding: 20,
        paddingTop: 120,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    header: {
        color: '#f2a9a5',
        fontSize: 32,
        marginBottom: 20,
        paddingLeft: 20,
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: 'MonaspaceRadonWide',
        // fontWeight: 'bold',
    },
    calenderQuickView: {
        width: '100%',
        height: 400,
        backgroundColor: '#222',      // slightly lighter than the background
        borderRadius: 12,             // smooth corners
        padding: 12,                  // give the calendar some breathing room
        justifyContent: 'center',
        color: '#faf9f6',
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,

        // Android shadow
        elevation: 4,
    },
    fab: {
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#f2a9a5',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
