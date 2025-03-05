import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { getFarmTypes, getCrops, api } from '../../utils/api'; // Assuming you've exported 'api' from api.js

const AdminConfigScreen = () => {
  const [farmTypes, setFarmTypes] = useState([]);
  const [crops, setCrops] = useState([]);
  const [newFarmType, setNewFarmType] = useState('');
  const [newCrop, setNewCrop] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

useEffect(() => {
    fetchData();
}, []);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const farmTypesResponse = await getFarmTypes();
      setFarmTypes(farmTypesResponse.data);
      const cropsResponse = await getCrops();
      setCrops(cropsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please check your network connection.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleAddFarmType = async () => {
    if (!newFarmType.trim()) {
      Alert.alert('Validation Error', 'Farm type name cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/farmtype/', { name: newFarmType });
      setNewFarmType('');
      fetchData();
      Alert.alert('Success', 'Farm type added successfully.');
    } catch (error) {
      console.error('Error adding farm type:', error);
      Alert.alert('Error', 'Failed to add farm type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = async () => {
    if (!newCrop.trim()) {
      Alert.alert('Validation Error', 'Crop name cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/crop/', { name: newCrop });
      setNewCrop('');
      fetchData();
      Alert.alert('Success', 'Crop added successfully.');
    } catch (error) {
      console.error('Error adding crop:', error);
      Alert.alert('Error', 'Failed to add crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Configuration</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <Text style={styles.sectionTitle}>Farm Types</Text>
      {farmTypes.map((type) => (
        <Text key={type.id} style={styles.listItem}>{type.farm_type_name}</Text>
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
        <Text key={crop.id} style={styles.listItem}>{crop.crop_name}</Text>
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

// ... (styles remain the same)

export default AdminConfigScreen;