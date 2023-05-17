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
import SignOutButton from './src/component/SignOutButton'
import { View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
const Stack = createStackNavigator();

export default function App() {
  // const navigation = useNavigation();
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log('Authorization status:', authStatus);
    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    )
      messaging()
        .getToken()
        .then((fcmToken) => {
          console.log('FCM Token', fcmToken);
        })
  };
  useEffect(() => {
    // if (requestUserPermission()) {
    //   messaging()
    //     .getToken()
    //     .then((fcmToken) => {
    //       console.log('FCM Token', fcmToken);
    //     })
    // } else {
    //   console.log('Not authorisation status');
    // }
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Notification data:', remoteMessage.data);
    });
    return unsubscribe;
  }, [])
  return (
    <LoginInfoProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Input" component={InputScreen} />
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
              // headerTitleAlign: 'center',
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
