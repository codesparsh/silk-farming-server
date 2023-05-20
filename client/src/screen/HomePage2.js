import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LoginContext } from '../context/LoginInfoProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { URL } from "../component/constant"
const HomePage2 = () => {
    const { userInfo, updateUserInfo } = useContext(LoginContext);
    const [sanitation, setSanitation] = useState('NA');
    const navigation = useNavigation();
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
    const callInputScreen = () => {
        navigation.navigate('Input', { username: userInfo.username })
    }
    const callNewScreen = () => {
        navigation.navigate('Graph')
    }
    const callUpdateSanitation = () => {
        const currentDate = new Date();

        fetch(`${URL}/user/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userInfo.username,
                sanitation: formatDate(currentDate.toISOString())
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
    return (
        <View style={[styles.container, { backgroundColor: '#E1FFE1' }]}>
            <View style={styles.cardContainer}>
                <TouchableOpacity style={styles.editButton} onPress={callInputScreen}>
                    <Icon name="pencil" style={styles.editButtonIcon} />
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <Text style={styles.cardTitle}>User Details</Text>
                <View style={styles.userInfo}>
                    <Icon name="person" style={styles.icon} />
                    <Text style={styles.cardText}>
                        Username: <Text style={styles.boldText}>{userInfo.username}</Text>
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Icon name="albums" style={styles.icon} />
                    <Text style={styles.cardText}>
                        Number of Tiers: <Text style={styles.boldText}>{userInfo.tiers}</Text>
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Icon name="resize" style={styles.icon} />
                    <Text style={styles.cardText}>
                        Dimension of Field: <Text style={styles.boldText}>{userInfo.shedDimensions}</Text>
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Icon name="bug" style={styles.icon} />
                    <Text style={styles.cardText}>
                        Species of silkworm: <Text style={styles.boldText}>{userInfo.species}</Text>
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Icon name="location" style={styles.icon} />
                    <Text style={styles.cardText}>
                        State: <Text style={styles.boldText}>{userInfo.state}</Text>
                    </Text>
                </View>
            </View>
            <View style={styles.cardContainer}>
                <TouchableOpacity style={styles.addButton} onPress={callUpdateSanitation}>
                    <Text style={styles.addButtonLabel}>Add Sanitation Log</Text>
                </TouchableOpacity>
                <Text style={styles.cardText}>
                    Last sanitation was done on<Text style={styles.boldText}> {sanitation}</Text>
                </Text>
            </View>
            <TouchableOpacity style={styles.cardContainer} onPress={callNewScreen}>
                <Text style={[styles.cardTitle, {color:"#53A548"}]}>View Temperature and Humidity of Shed</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d1f7d1', // Light green background color
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#555',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    icon: {
        fontSize: 18,
        marginRight: 10,
        color: '#555',
    },
    cardText: {
        fontSize: 16,
        color: '#333',
    },
    addButton: {
        backgroundColor: '#4C934C', // Light green button color
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    addButtonLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        backgroundColor: '#4C934C', // Light green button color
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButtonIcon: {
        color: '#fff',
        fontSize: 12,
        marginRight: 5,

    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 5,
    },
    boldText: {
        fontWeight: 'bold',
    },
};



export default HomePage2;
