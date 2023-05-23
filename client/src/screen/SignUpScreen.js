import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ToastAndroid } from 'react-native';
import {URL} from "../component/constant" 
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import Sound from 'react-native-sound';
const notificationSound = new Sound('notification_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load the sound file', error);
    }
  });
const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('Message handled in the foreground!', remoteMessage);
            const { title, body } = remoteMessage.notification;
            notificationSound.play((success) => {
                if (success) {
                  console.log('Notification sound played successfully');
                } else {
                  console.log('Failed to play the notification sound');
                }
              });
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
    const handleSignUp = () => {
        if (password === confirmPassword) {
            fetch(`${URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "Success") {
                        callRegistration()
                        navigation.navigate('Input', { username: username });
                    }
                    console.log(data);
                })
                .catch(error => {
                    ToastAndroid.show('User already exists', ToastAndroid.SHORT, ToastAndroid.RED);
                    console.error(error);
                });
        } else {
            ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT, ToastAndroid.RED);
        }
    }
    const callIsLogin = () => {
        navigation.navigate('Login');
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="person-outline" size={24} color="#63C132" />
                <Text style={styles.title}>Create Account</Text>
            </View>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={18} color="#63C132" />
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
                    <Ionicons name="lock-closed-outline" size={18} color="#63C132" />
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
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={18} color="#63C132" />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        secureTextEntry={true}
                        placeholderTextColor="#CCCCCC"
                        color="#000000"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Already have an account?{' '}
                    <Text style={styles.footerLink} onPress={callIsLogin}>Login</Text>
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
        color: '#63C132',
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
        backgroundColor: '#63C132',
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
        color: '#63C132',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
