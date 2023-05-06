import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to the Home Screen</Text>
      <TouchableOpacity style={styles.button}>
        <Icon name="user" size={18} color="#fff" />
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Icon name="bar-chart" size={18} color="#fff" />
        <Text style={styles.buttonText}>Remote Monitor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom : 80,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;
