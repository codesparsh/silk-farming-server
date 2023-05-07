import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import {URL} from "../component/constant" 
const SilkwormForm = () => {
  
  const [silkwormSpecies, setSilkwormSpecies] = useState('');
  const [numTiers, setNumTiers] = useState('');
  const [shedDimensions, setShedDimensions] = useState('');
  const [state, setState] = useState('');
  const handleCancel = () => {
    
    setSilkwormSpecies('');
    setNumTiers('');
    setShedDimensions('');
    setState('');
    navigation.navigate('Home', {user: data.user});
  };
  const route = useRoute();
  const navigation= useNavigation();
  const handleSubmit = () => {
    
    fetch(`${URL}/user/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: route.params.username,
        tiers: numTiers,
        species: silkwormSpecies,
        shedDimensions: shedDimensions,
        state: state,
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "Success") {
          navigation.navigate('Home', {user: data.user});
        }
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Silkworm species</Text>
      <Picker
        style={styles.picker}
        selectedValue={silkwormSpecies}
        onValueChange={(value) => setSilkwormSpecies(value)}
      >
        <Picker.Item label="Select silkworm species" value="" />
        <Picker.Item label="Mulberry" value="Mulberry" />
        <Picker.Item label="Tasar" value="Tasar" />
        <Picker.Item label="Muga" value="Muga" />
        <Picker.Item label="Eri" value="Eri" />
      </Picker>

      <Text style={styles.label}>Number of tiers</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter number of tiers"
        value={numTiers}
        onChangeText={(text) => setNumTiers(text)}
      />

      <Text style={styles.label}>Dimensions of rearing shed in sq ft</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter dimensions of rearing shed"
        value={shedDimensions}
        onChangeText={(text) => setShedDimensions(text)}
      />

      <Text style={styles.label}>State</Text>
      <Picker
        style={styles.picker}
        selectedValue={state}
        onValueChange={(value) => setState(value)}
      >
        <Picker.Item label="Select state" value="" />
        <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
        <Picker.Item label="Arunachal Pradesh" value="Arunachal Pradesh" />
        <Picker.Item label="Assam" value="Assam" />
        <Picker.Item label="Bihar" value="Bihar" />
        <Picker.Item label="Chhattisgarh" value="Chhattisgarh" />
        <Picker.Item label="Goa" value="Goa" />
        <Picker.Item label="Gujarat" value="Gujarat" />
        <Picker.Item label="Haryana" value="Haryana" />
        <Picker.Item label="Himachal Pradesh" value="Himachal Pradesh" />
        <Picker.Item label="Jharkhand" value="Jharkhand" />
        <Picker.Item label="Karnataka" value="Karnataka" />
        <Picker.Item label="Kerala" value="Kerala" />
        <Picker.Item label="Madhya Pradesh" value="Madhya Pradesh" />
        <Picker.Item label="Maharashtra" value="Maharashtra" />
        <Picker.Item label="Manipur" value="Manipur" />
        <Picker.Item label="Meghalaya" value="Meghalaya" />
        <Picker.Item label="Mizoram" value="Mizoram" />
        <Picker.Item label="Nagaland" value="Nagaland" />
        <Picker.Item label="Odisha" value="Odisha" />
        <Picker.Item label="Punjab" value="Punjab" />
        <Picker.Item label="Rajasthan" value="Rajasthan" />
        <Picker.Item label="Sikkim" value="Sikkim" />
        <Picker.Item label="Tamil Nadu" value="Tamil Nadu" />
        <Picker.Item label="Telangana" value="Telangana" />
        <Picker.Item label="Tripura" value="Tripura" />
        <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
        <Picker.Item label="Uttarakhand" value="Uttarakhand" />
        <Picker.Item label="West Bengal" value="West Bengal" />
      </Picker>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 40,
    backgroundColor: '#EFEFF4',
    borderRadius: 10,
    margin: 13,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#1C1C1E'
  },
  input: {
    height: 40,
    borderColor: '#8E8E93',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#1C1C1E'
  },
  picker: {
    height: 40,
    borderColor: '#8E8E93',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#1C1C1E'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  cancelButton: {
    backgroundColor: '#FFC0CB',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#00BFFF',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  }

});

export default SilkwormForm;
