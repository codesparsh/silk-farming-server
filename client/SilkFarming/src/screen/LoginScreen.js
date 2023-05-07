import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import SignUpScreen from './SignUpScreen';

const LoginScreen = ({navigation}) => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUP] = useState(false);
    const handleLogin = () => {
        // handle login logic here
    }
    const callIsSignUp = () => {
        navigation.navigate('SignUp');
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="log-in" size={32} color="#0066CC" />
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
