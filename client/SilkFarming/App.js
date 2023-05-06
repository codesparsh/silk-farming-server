import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/screen/LoginScreen';
import SignUpScreen from './src/screen/SignUpScreen';
import InputScreen from './src/screen/InputScreen';
import SafeAreaView from 'react-native-safe-area-view';
import HomePage from './src/screen/HomePage';


export default function App() {
  return (
    <View style={styles.container}>
      <InputScreen/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
