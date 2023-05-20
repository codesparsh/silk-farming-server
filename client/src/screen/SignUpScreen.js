import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ToastAndroid } from 'react-native';
import {URL} from "../component/constant" 
const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
