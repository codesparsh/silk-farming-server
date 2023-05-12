import React from 'react';
import LoginInfoProvider from './src/context/LoginInfoProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screen/LoginScreen';
import SignUpScreen from './src/screen/SignUpScreen';
import InputScreen from './src/screen/InputScreen';
import HomePage from './src/screen/HomePage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LoginInfoProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Input" component={InputScreen} />
          <Stack.Screen name="Home" component={HomePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginInfoProvider>
  );
}
