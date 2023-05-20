import React, { useEffect } from 'react';
import LoginInfoProvider from './src/context/LoginInfoProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screen/LoginScreen';
import SignUpScreen from './src/screen/SignUpScreen';
import InputScreen from './src/screen/InputScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Alert, Text } from 'react-native';
import GraphComponent from './src/screen/TempAndHumidityScreen';
import HomePage2 from './src/screen/HomePage2';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LoginInfoProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Input" component={InputScreen} />
          <Stack.Screen
            name="Graph"
            component={GraphComponent}
            options={({ navigation }) => ({
              headerShown: true,
              title: '',
              headerStyle: {
                backgroundColor: '#4CAF50', // Green color
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  style={{
                    marginRight: 16,
                    backgroundColor: '#fff', // Light green color
                    borderRadius: 30,
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="log-out" size={16} color="#659157" />
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity onPress={() => navigation.navigate("Page")}>
                    <Ionicons
                      style={{ paddingHorizontal: 4 }}
                      name="arrow-back"
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#FFF", // White color
                      fontSize: 20,
                      paddingLeft: 4,
                    }}
                  >
                    SilkSense
                  </Text>
                </View>
              ),
            })}
          />

          <Stack.Screen name="Page"
            component={HomePage2}
            options={({ navigation }) => ({
              headerShown: true,
              title: '',
              headerStyle: {
                backgroundColor: '#4CAF50'
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Login")}
                  style={{
                    marginRight: 16,
                    backgroundColor: '#fff',
                    borderRadius: 30,
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Ionicons name="log-out" size={16} color="#659157" />
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#FFF", // White color
                      fontSize: 20,
                      paddingLeft: 24,
                    }}
                  >
                    SilkSense
                  </Text>
                </View>
              ),

            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginInfoProvider>
  );
}
