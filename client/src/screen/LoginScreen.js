import React, { useState, useEffect, useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ToastAndroid } from 'react-native';
import { URL } from "../component/constant"
import SignUpScreen from './SignUpScreen';
import { LoginContext } from '../context/LoginInfoProvider'
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import ForegroundNotification from '../component/ForegroundNotification';
const LoginScreen = ({ navigation }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { userInfo, updateUserInfo } = useContext(LoginContext);
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('Message handled in the foreground!', remoteMessage);
            const { title, body } = remoteMessage.notification;
            Alert.alert(
                title,
                body,
                [
                  {
                    text: 'Dismiss',
                    onPress: () => console.log('Notification dismissed'),
                  },
                ],
                // { customComponent: <ForegroundNotification title={remoteMessage.notification.title} message={remoteMessage.notification.body} /> }
              );
        });
    
        return unsubscribe;
      }, []);
    const callRegistration = () => {
        const requestUserPermission = async () => {
            const authStatus = await messaging().requestPermission();
            console.log('Authorization status:', authStatus);
            return (
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL
            );
        };
        const setupMessaging = async () => {
            const permissionGranted = await requestUserPermission();

            if (permissionGranted) {
                messaging()
                    .getToken()
                    .then((fcmToken) => {

                        fetch(`${URL}/register`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                registrationToken: fcmToken
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                            })
                            .catch(error => {
                                console.error(error);
                            });
                        console.log('FCM Token', fcmToken);

                    })
                    .catch((error) => {
                        console.log('Failed to get FCM token:', error);
                    });
            } else {
                console.log('Authorization status not granted');
            }
        };
        setupMessaging();

        
    }

    const handleLogin = () => {
        fetch(`${URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,

            })
        })
            .then(response => response.json())
            .then(data => {
                // callToken
                if (data.status === "Success") {
                    updateUserInfo(data.user)
                    callRegistration()
                    // AsyncStorage.setItem('user', JSON.stringify(data.user));
                    navigation.navigate('Home', { user: data.user });
                }
                console.log(data);
            })
            .catch(error => {
                ToastAndroid.show('Wrong Password', ToastAndroid.SHORT, ToastAndroid.RED);
                console.error(error);
            });
    }



    const callIsSignUp = () => {
        navigation.navigate('SignUp');
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="log-in-outline" size={32} color="#0066CC" />
                <Text style={styles.title}>Login</Text>
            </View>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={18} color="#CCCCCC" />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={setUsername}
                        value={username}
                        autoCapitalize="none"
                        placeholderTextColor="#CCCCCC"
                        color="#000000"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={18} color="#CCCCCC" />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                        placeholderTextColor="#CCCCCC"
                        color="#000000"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Don't have an account yet?{' '}
                    <Text style={styles.footerLink} onPress={callIsSignUp}>Sign up</Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0066CC',
    },
    form: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        width: '80%',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        margin: 10,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#0066CC',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '80%',
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#333333',
    },
    footerLink: {
        color: '#0066CC',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
