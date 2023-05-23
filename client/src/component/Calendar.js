import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import { LoginContext } from '../context/LoginInfoProvider';
const CalendarComponent = () => {
    const [startDate, setStartDate] = useState(null);
    const [sanitation, setSanitation] = useState('NA');
    const { userInfo, updateUserInfo } = useContext(LoginContext);
    const [endDate, setEndDate] = useState(null);
    const [markedDates, setMarkedDates] = useState({});
    const route = useRoute();
    const navigation = useNavigation();
    const callUpdateSanitation = () => {
        const currentDate = new Date();

        fetch(`${URL}/user/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userInfo.username,
                sanitation: (currentDate.toISOString())
            })
        })
            .then(response => response.json())
            .then(data => {
                setSanitation(data.user.sanitation)
            })
            .catch(error => {
                console.error(error);
            });
    }
    useEffect(() => {
        setSanitation(userInfo.sanitation)
    }, []);
    const handleDayPress = (day) => {
        if (!startDate || (startDate && endDate)) {
          // Selecting the start date
          setStartDate(day.dateString);
          setEndDate(null);
          setMarkedDates({
            [day.dateString]: { startingDay: true, color: '#63C132' },
            ...highlightSelectedDate(route.params.date, day.dateString) // Pass the selected date to highlight
          });
        } else if (startDate && !endDate) {
          // Selecting the end date
          const range = generateDateRange(startDate, day.dateString);
          setEndDate(day.dateString);
          setMarkedDates({ ...markedDates, ...range, [day.dateString]: { endingDay: true, color: '#63C132' } });
        }
      };
      
      


    const generateDateRange = (start, end) => {
        const range = {};
        const startDate = new Date(start);
        const endDate = new Date(end);

        const currentDate = new Date(startDate);
        const today = new Date();
        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().slice(0, 10);
            const isDisabled = currentDate < today || currentDate < startDate;
            range[dateString] = { color: '#63C132', selected: true, disabled: isDisabled };
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return range;
    };
    const highlightSelectedDate = (utcDate, selectedDate) => {
        const selectedDateString = new Date(utcDate).toISOString().split('T')[0];
        const markedDates = {
            [selectedDateString]: { selected: true, marked: true },
            [selectedDate]: { selected: true, marked: true }, // Use the selected date
        };

        return markedDates;
    };


    return (
        <View style={styles.container}>
            <Card containerStyle={styles.card}>
                <Calendar
                    markedDates={highlightSelectedDate(route.params.date)}
                    onDayPress={handleDayPress}
                    style={styles.calendar}
                    theme={{
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        dayTextColor: '#2d4150',
                        todayTextColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        monthTextColor: '#2d4150',
                        selectedDayBackgroundColor: '#9EE37D',
                        arrowColor: '#9EE37D',
                        textDisabledColor: '#d9e1e8',
                        textDayFontWeight: '600',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '600',
                        textDayFontSize: 12,
                        textMonthFontSize: 14,
                        textDayHeaderFontSize: 12,
                    }}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Page')}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logButton} onPress={callUpdateSanitation}>
                        <Text style={styles.buttonText}>Log</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomTextContainer}>
                    <Text style={styles.bottomText}>
                        Last sanitation was done on <Text style={styles.dateHighlight}> 23 May 2023</Text>
                    </Text>
                    <Text style={styles.bottomText}>
                        Next sanitation to be done on <Text style={styles.dateHighlight}> 23 May 2023</Text>
                    </Text>
                </View>
            </Card>
        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,

    },
    card: {
        borderRadius: 8,
        elevation: 2,
        height: 450,
    },
    calendarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    calendar: {
        height: 300,
        width: '100%',
        // borderWidth: 1,
        borderColor: '#d9e1e8',
        borderRadius: 4,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 16
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#FF6565',
        borderRadius: 4,
        paddingVertical: 12,
        marginRight: 8,
    },
    logButton: {
        flex: 1,
        backgroundColor: '#63C132',
        borderRadius: 4,
        paddingVertical: 12,
        marginLeft: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        textAlign: 'center',
    },
    bottomTextContainer: {
        paddingHorizontal: 16,
    },
    bottomText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        color: '#525252',
        fontStyle: 'italic'
    },
    dateHighlight: {
        color: '#333333',
        fontWeight: 'bold',
    },
});
export default CalendarComponent;
