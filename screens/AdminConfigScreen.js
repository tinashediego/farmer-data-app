import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { getFarmTypes, getCrops, api } from '../utils/api'; // Assuming you've exported 'api' from api.js
import { storeData } from '../utils/storage';

const AdminConfigScreen = () => {
  const [farmTypes, setFarmTypes] = useState([]);
  const [crops, setCrops] = useState([]);
  const [newFarmType, setNewFarmType] = useState('');
  const [newCrop, setNewCrop] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const farmTypesResponse = await getFarmTypes();
      setFarmTypes(farmTypesResponse.data);
      const cropsResponse = await getCrops();
      setCrops(cropsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddFarmType = async () => {
    try {
      await api.post('/farmtype/', { name: newFarmType });
      setNewFarmType('');
      fetchData(); // Refresh data after adding
      Alert.alert('Success', 'Farm type added successfully.');
    } catch (error) {
      console.error('Error adding farm type:', error);
      Alert.alert('Error', 'Failed to add farm type.');
    }
  };

  const handleAddCrop = async () => {
    try {
      await api.post('/crop/', { name: newCrop });
      setNewCrop('');
      fetchData(); // Refresh data after adding
      Alert.alert('Success', 'Crop added successfully.');
    } catch (error) {
      console.error('Error adding crop:', error);
      Alert.alert('Error', 'Failed to add crop.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Configuration</Text>

      <Text style={styles.sectionTitle}>Farm Types</Text>
      {farmTypes.map((type) => (
        <Text key={type.id} style={styles.listItem}>{type.name}</Text>
      ))}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Farm Type"
          value={newFarmType}
          onChangeText={setNewFarmType}
        />
        <Button title="Add Farm Type" onPress={handleAddFarmType} />
      </View>

      <Text style={styles.sectionTitle}>Crops</Text>
      {crops.map((crop) => (
        <Text key={crop.id} style={styles.listItem}>{crop.name}</Text>
      ))}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Crop"
          value={newCrop}
          onChangeText={setNewCrop}
        />
        <Button title="Add Crop" onPress={handleAddCrop} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default AdminConfigScreen;