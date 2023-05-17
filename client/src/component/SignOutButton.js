import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SignOutButton = () => {
  const navigation = useNavigation();
  const signOut = async () => {
    
    try {
      await AsyncStorage.clear();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <TouchableOpacity onPress={navigation.navigate('Login')} style={{
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
  );
};

export default SignOutButton;
