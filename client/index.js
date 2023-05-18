/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    Alert.alert('Message handled in the background!', JSON.stringify(remoteMessage));
});
messaging().getInitialNotification(async remoteMessage => {
    console.log('Message handled in the kill state!', remoteMessage);
    Alert.alert('Message handled in the kill state!', JSON.stringify(remoteMessage));
});
AppRegistry.registerComponent(appName, () => App);
