import React, { useEffect } from 'react';
import LoginInfoProvider from './src/context/LoginInfoProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screen/LoginScreen';
import SignUpScreen from './src/screen/SignUpScreen';
import HomePage from './src/screen/HomePage';
import InputScreen from './src/screen/InputScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Alert } from 'react-native';
import GraphComponent from './src/screen/TempAndHumidityScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LoginInfoProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Input" component={InputScreen} />
          <Stack.Screen name="Graph" component={GraphComponent} />
          <Stack.Screen name="Home"
            component={HomePage}
            options={({ navigation }) => ({
              headerShown: true,
              title: 'My home',
              headerStyle: {
                backgroundColor: '#2B2D42'
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Login")}
                  style={{
                    marginRight: 16,
                    backgroundColor: '#F0A202',
                    borderRadius: 30,
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Ionicons name="log-out-outline" size={16} color="#2B2D42" />
                </TouchableOpacity>
              ),
              headerLeft: () => (<View />)

            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginInfoProvider>
  );
}
