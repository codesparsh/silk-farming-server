import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {URL} from "../component/constant" 
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState('NA');
  const [humidity, setHumidity] = useState('NA');
  const [sanitation, setSanitation] = useState('NA');
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params
  useEffect(() => {
    if (user !== undefined && user !== null) {
      setLoading(false)
    }
    setSanitation(user.sanitation)
  }, [user]);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? "Pm" : "Am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    return `${formattedHours}:${minutes < 10 ? "0" + minutes : minutes} ${amOrPm}, ${day} ${month} ${year}`;
  }

  const callInputScreen = () => {
    navigation.navigate('Input', { username: user.username })
  }
  const callUpdateSanitation = () => {
    console.log("in")
    const currentDate = new Date();

    fetch(`${URL}/user/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user.username,
        sanitation: formatDate(currentDate.toISOString())
      })
    })
      .then(response => response.json())
      .then(data => {
        setSanitation(formatDate(currentDate.toISOString()))
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }
  const callTempAndHumidity = () => {
    fetch(`${URL}/list/feeds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user.username
      })
    })
      .then(response => response.json())
      .then(data => {
        if(data.feeds[0].temperature!= null) setTemp(data.feeds[0].temperature)
        if(data.feeds[0].humidity!= null) setHumidity(data.feeds[0].humidity)
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }
  return (

    loading ?
      <ActivityIndicator size="large" color="#0000ff" />
      :
      <View style={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.editButton} onPress={callInputScreen}>
            <MaterialCommunityIcons
              name="pencil"
              size={14}
              color="#2B2D42"
            />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.contentItem}>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color="#fff"
              />
              <Text style={styles.contentText}>
                Owner: <Text style={styles.contentTextBold}>{user.username}</Text>
              </Text>
            </View>
            <View style={styles.contentItem}>
              <MaterialCommunityIcons
                name="layers"
                size={24}
                color="#fff"
              />
              <Text style={styles.contentText}>
                Number of Tiers: <Text style={styles.contentTextBold}>{user.tiers}</Text>
              </Text>
            </View>
            <View style={styles.contentItem}>
              <MaterialCommunityIcons
                name="ruler"
                size={24}
                color="#fff"
              />
              <Text style={styles.contentText}>
                Dimensions of Shed: <Text style={styles.contentTextBold}>{user.shedDimensions} ft</Text>
              </Text>
            </View>
            <View style={styles.contentItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color="#fff"
              />
              <Text style={styles.contentText}>
                State: <Text style={styles.contentTextBold}>{user.state}</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.temperatureButton} onPress={callTempAndHumidity}>
            <Text style={styles.temperatureButtonText}>Tap to check the current temprature and humidity</Text>
          </TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.contentItem}>
              <MaterialCommunityIcons
                name="thermometer"
                size={18}
                color="#fff"
              />
              <Text style={styles.contentText}>
                <Text style={styles.contentTextBold}>{temp}°C last recorded on</Text>
              </Text>
            </View>
            <View style={styles.contentItem}>
              <MaterialCommunityIcons
                name="water"
                size={18}
                color="#fff"
              />
              <Text style={styles.contentText}>
                <Text style={styles.contentTextBold}>{humidity}% last recorded on</Text>
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <TouchableOpacity style={styles.temperatureButton}>
            <Text style={styles.temperatureButtonText} onPress={callUpdateSanitation}>Add Sanitaion Logs</Text>
          </TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.contentItem}>
              <MaterialCommunityIcons
                name="calendar"
                size={18}
                color="#fff"
              />
              <Text style={styles.contentText}>
                Last sanitation was done on<Text style={styles.contentTextBold}> {sanitation}</Text>
              </Text>
            </View>

          </View>
        </View>


      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  card: {
    backgroundColor: '#2B2D42',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
    width: 300,
  },
  editButton: {
    backgroundColor: '#F0A202',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  editButtonText: {
    color: '#2B2D42',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  content: {
    marginTop: 5,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#fff',
  },
  contentTextBold: {
    fontWeight: 'bold',
  },
  temperatureCard: {
    backgroundColor: '#2B2D42',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  temperatureButton: {
    backgroundColor: '#F0A202',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 4,
  },
  temperatureButtonText: {
    color: '#2B2D42',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 2,
    
  },
});



export default HomePage;
