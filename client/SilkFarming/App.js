import React from 'react';
import LoginInfoProvider from './src/context/LoginInfoProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screen/LoginScreen';
import SignUpScreen from './src/screen/SignUpScreen';
import InputScreen from './src/screen/InputScreen';
import HomePage from './src/screen/HomePage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();MaterialCommunityIcons

export default function App() {
  return (
    <LoginInfoProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Input" component={InputScreen} />
          <Stack.Screen name="Home"
            component={HomePage}
            options={
              {
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
                  <TouchableOpacity style={{
                    marginRight: 16,
                    backgroundColor: '#F0A202',
                    borderRadius: 30,
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <MaterialCommunityIcons name="logout" size={16} color="#2B2D42" />
                  </TouchableOpacity>
                )
              }
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginInfoProvider>
  );
}
