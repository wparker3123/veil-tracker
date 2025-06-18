import { useRouter } from 'expo-router';
import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
//import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { MaterialIcons } from '@expo/vector-icons';

const today = toDateId(new Date());

export default function MainScreen() {
    const router = useRouter();
    const daysUntil = 5; // placeholder
    const [selectedDate, setSelectedDate] = useState(today);

    return (
        <View style={styles.container}>
            <Text style={[styles.header, {color: '#faf9f6'}]}>Next Cycle in: </Text>
            <Text style={styles.header}>{daysUntil} days</Text>
            {/*<Text style={styles.header}>Selected date: {selectedDate}</Text>*/}
            {/*<View style={styles.calendarPlaceholder}>*/}
            {/*    <Text style={{ color: '#888' }}>[Calendar here]</Text>*/}
            {/*    <Calendar*/}
            {/*        onDayPress={day => {*/}
            {/*            console.log('selected day', day);*/}
            {/*            router.push({pathname: '/day-details', params: {day: day.dateString}})*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</View>*/}
            <Text>Selected date: {selectedDate}</Text>
            <View style={styles.calenderQuickView}>
                <Calendar.List
                    calendarMaxDateId={today}
                    onCalendarDayPress={(day) =>
                        router.push({
                            pathname: '/day-details',
                            params: {
                                selected_date: day,
                            }
                        })
                }
                />
            </View>
            {/*<Button onPress={(e) => {*/}
            {/*    router.push('/signin');*/}
            {/*}} title={'Test Button'}></Button>*/}

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
        backgroundColor: '#000',
        padding: 20,
        height: '30%',
        paddingTop: '20%',
        // alignItems: 'center',
    },
    header: {
        color: '#fbc3b2',
        fontSize: 32,
        marginBottom: 20,
        textAlign: 'center',
        paddingLeft: 20,
        fontFamily: 'MonaspaceRadonWide',
    },
    calendarPlaceholder: {
        flex: 1,
        backgroundColor: '#111',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calenderQuickView: {
        height: 400,
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: '15%',               // 30px up from the bottom of the container
        alignSelf: 'center',      // horizontally centered
        backgroundColor: '#f2a9a5',
        width:  60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: { fontSize: 32, color: '#faf9f6' },
});
