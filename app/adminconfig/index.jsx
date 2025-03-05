import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const AdminConfigScreen = () => {
  const [crops, setCrops] = useState([]);
  const [farmTypes, setFarmTypes] = useState([]);
  const [token, setToken] = useState(null);
  const [isCropModalVisible, setIsCropModalVisible] = useState(false);
  const [isFarmTypeModalVisible, setIsFarmTypeModalVisible] = useState(false);
  const [cropData, setCropData] = useState({ crop_name: '' });
  const [farmTypeData, setFarmTypeData] = useState({ farm_type_name: '' });
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then((value) => {
      if (value) {
        setToken(value);
        syncOfflineData(value);
        handleFetchCrop(value);
        handleFetchFarmType(value);
      }
    });
    
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        syncOfflineData(token);
      }
    });

    return () => unsubscribe();
  }, [token]);

  const storeOfflineData = async (key, data) => {
    let storedData = await AsyncStorage.getItem(key);
    storedData = storedData ? JSON.parse(storedData) : [];
    storedData.push(data);
    await AsyncStorage.setItem(key, JSON.stringify(storedData));
  };

  const syncOfflineData = async (token) => {
    const offlineCrops = await AsyncStorage.getItem('offlineCrops');
    if (offlineCrops) {
      const cropsData = JSON.parse(offlineCrops);
      for (const crop of cropsData) {
        await handleSubmitCrop(crop, token);
      }
      await AsyncStorage.removeItem('offlineCrops');
    }

    const offlineFarmTypes = await AsyncStorage.getItem('offlineFarmTypes');
    if (offlineFarmTypes) {
      const farmTypesData = JSON.parse(offlineFarmTypes);
      for (const farmType of farmTypesData) {
        await handleSubmitFarmType(farmType, token);
      }
      await AsyncStorage.removeItem('offlineFarmTypes');
    }
  };

  const handleSubmitCrop = async (data = cropData, authToken = token) => {
    if (!isConnected) {
      await storeOfflineData('offlineCrops', data);
      Alert.alert('Offline', 'Crop saved offline and will sync later.');
      setIsCropModalVisible(false);
      setCropData({ crop_name: '' });
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/crop/', data, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      Alert.alert('Success', 'Crop added successfully');
      setIsCropModalVisible(false);
      setCropData({ crop_name: '' });
      handleFetchCrop(authToken);
    } catch (error) {
      console.error('Error adding crop:', error);
      Alert.alert('Error', 'Failed to add crop.');
    }
  };

  const handleSubmitFarmType = async (data = farmTypeData, authToken = token) => {
    if (!isConnected) {
      await storeOfflineData('offlineFarmTypes', data);
      Alert.alert('Offline', 'Farm type saved offline and will sync later.');
      setIsFarmTypeModalVisible(false);
      setFarmTypeData({ farm_type_name: '' });
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/farmtype/', data, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      Alert.alert('Success', 'Farm type added successfully');
      setIsFarmTypeModalVisible(false);
      setFarmTypeData({ farm_type_name: '' });
      handleFetchFarmType(authToken);
    } catch (error) {
      console.error('Error adding farm type:', error);
      Alert.alert('Error', 'Failed to add farm type.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setIsCropModalVisible(true)}>
        <Text style={styles.buttonText}>Add Crop</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setIsFarmTypeModalVisible(true)}>
        <Text style={styles.buttonText}>Add Farm Type</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  button: { padding: 12, borderRadius: 8, backgroundColor: '#007bff', marginVertical: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default AdminConfigScreen;