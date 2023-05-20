import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import {URL} from "../component/constant" 
import { LoginContext } from '../context/LoginInfoProvider';

const GraphComponent = () => {
    const [temperatureData, setTemperatureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [createdAtData, setCreatedAtData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [temp, setTemp] = useState('NA');
    const [humidity, setHumidity] = useState('NA');
    const [tempTime, setTempTime] = useState('NA');
    const { userInfo, updateUserInfo } = useContext(LoginContext);
    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const amOrPm = hours >= 12 ? "Pm" : "Am";
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
    
        return `${formattedHours}:${minutes < 10 ? "0" + minutes : minutes} ${amOrPm}, ${day} ${month} ${year}`;
      }
    const callGraphData = () => {
        const channelId = '2058499';
        const apiKey = 'X4IOG5HEJPU1SJ8J';
        const apiUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=10`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                const temperatures = data.feeds
                    .map((feed) => parseFloat(feed.field1))
                    .filter((value) => !isNaN(value)) // Filter out NaN values
                // .map((value) => value.toFixed(2));

                const humidities = data.feeds
                    .map((feed) => parseFloat(feed.field2))
                    .filter((value) => !isNaN(value)) // Filter out NaN values
                // .map((value) => value.toFixed(2));

                const createdAts = data.feeds
                    .map((feed) => feed.created_at)
                    .filter((value) => value !== null && value !== 'NaN')
                    .map((created_at) => {
                        const date = new Date(created_at);
                        const hours = date.getHours();
                        const minutes = date.getMinutes();
                        const period = hours >= 12 ? 'PM' : 'AM';
                        const formattedHours = hours % 12 || 12;
                        const formattedMinutes = minutes.toString().padStart(2, '0');
                        const formattedTime = `${formattedHours}:${formattedMinutes} `;
                        return formattedTime;
                    });

                setTemperatureData(temperatures);
                setHumidityData(humidities);
                setCreatedAtData(createdAts);
                callTempAndHumidity()

            })
            .catch((error) => {
                console.error(error);
            });
    };
    const callTempAndHumidity = () => {
        fetch(`${URL}/list/feeds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: userInfo.username
          })
        })
          .then(response => response.json())
          .then(data => {
            console.log(data, "dataa");
            if (data.data.temperature != null) setTemp(data.data.temperature)
            if (data.data.humidity != null) setHumidity(data.data.humidity)
            setTempTime(formatDate(data.data.created_at))
            
            setIsLoading(false);
            
          })
          .catch(error => {
            console.error(error);
          });
      }
    useEffect(() => {
        console.log(createdAtData, humidityData, temperatureData, "he")
        console.log( userInfo, "valll")
        callGraphData()
        console.log( "check")
        
        
        
    }, []);
    
    const onCardClick = () => {
        setIsLoading(true)
        callGraphData()
    }

    console.log(createdAtData, humidityData, temperatureData, "he1")
    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    return (
        <TouchableOpacity onPress={onCardClick}>

            <View style={styles.cardContainer}>
                {/* <Text style={styles.cardTitle}>Tap refresh</Text> */}
                {isLoading ? (
                    <View style={[styles.container, styles.loadingContainer]}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <View style={styles.chartContainer}>
                        <View style={styles.infoContainer}>
                            <Icon name="thermometer" type="font-awesome" size={32} color="#FFD700" />
                            <Text style={styles.infoText}>
                                <Text style={styles.highlight}>{temp}°C</Text>
                            </Text>
                        </View>

                        <LineChart
                            data={{
                                labels: createdAtData,
                                datasets: [
                                    {
                                        data: temperatureData
                                    }
                                ]
                            }}
                            width={Dimensions.get("window").width - 32}
                            height={200}
                            yAxisSuffix="°C"
                            yAxisInterval={1}
                            chartConfig={{
                                backgroundColor: "#F5F5F5",
                                backgroundGradientFrom: "#FFD700",
                                backgroundGradientTo: "#FFA500",
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 0.8) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                        <View style={styles.infoContainer}>
                            <Icon name="water" type="font-awesome" size={32} color="#00C9FF" />
                            <Text style={styles.infoText}>
                                <Text style={styles.highlight}>{humidity}%</Text>
                            </Text>
                        </View>
                        <LineChart
                            data={{
                                labels: createdAtData,
                                datasets: [
                                    {
                                        data: humidityData
                                    }
                                ]
                            }}
                            width={Dimensions.get("window").width - 32}
                            height={200}
                            yAxisSuffix="%"
                            yAxisInterval={1}
                            chartConfig={{
                                backgroundColor: "#F5F5F5",
                                backgroundGradientFrom: "#00C9FF",
                                backgroundGradientTo: "#92FE9D",
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 0.8) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                        <Text style={styles.lastRecordedText}>
                            Last recorded on <Text style={styles.dateHighlight}>{tempTime}</Text>
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>

    );
};
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        padding: 16,
        elevation: 3,
        margin: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333333',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        paddingVertical: 20,
    },
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 32,
    },
    highlight: {
        color: 'green',
        // fontWeight: 'bold',
    },
    lastRecordedText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 14,
        color: '#888888',
    },
    dateHighlight: {
        color: '#333333',
        fontWeight: 'bold',
    },
});


export default GraphComponent;

