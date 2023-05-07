import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.editButton}>
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
              Owner: <Text style={styles.contentTextBold}>Kartikey</Text>
            </Text>
          </View>
          <View style={styles.contentItem}>
            <MaterialCommunityIcons
              name="layers"
              size={24}
              color="#fff"
            />
            <Text style={styles.contentText}>
              Number of Tiers: <Text style={styles.contentTextBold}>3</Text>
            </Text>
          </View>
          <View style={styles.contentItem}>
            <MaterialCommunityIcons
              name="ruler"
              size={24}
              color="#fff"
            />
            <Text style={styles.contentText}>
              Dimensions of Shed: <Text style={styles.contentTextBold}>10 x 12 ft</Text>
            </Text>
          </View>
          <View style={styles.contentItem}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color="#fff"
            />
            <Text style={styles.contentText}>
              State: <Text style={styles.contentTextBold}>Delhi</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.temperatureButton}>
          <Text style={styles.temperatureButtonText}>Check the Temperature</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.contentItem}>
            <MaterialCommunityIcons
              name="thermometer"
              size={18}
              color="#fff"
            />
            <Text style={styles.contentText}>
              Current Temperature is : <Text style={styles.contentTextBold}>28°C</Text>
            </Text>
          </View>

        </View>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.temperatureButton}>
          <Text style={styles.temperatureButtonText}>Check the Humidity</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.contentItem}>
            <MaterialCommunityIcons
              name="water"
              size={18}
              color="#fff"
            />
            <Text style={styles.contentText}>
              Current humidity is <Text style={styles.contentTextBold}>50%</Text>
            </Text>
          </View>

        </View>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.temperatureButton}>
          <Text style={styles.temperatureButtonText}>View Sanitaion Logs</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.contentItem}>
            <MaterialCommunityIcons
              name="calendar"
              size={18}
              color="#fff"
            />
            <Text style={styles.contentText}>
              Last sanitation was done on<Text style={styles.contentTextBold}> 4 Apr 20122</Text>
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
