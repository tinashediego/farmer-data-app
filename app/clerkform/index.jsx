import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

const ClerkFormScreen = () => {
  const [crops, setCrops] = useState([]);
  const [farmTypes, setFarmTypes] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [farmerData, setFarmerData] = useState({
    farmer_name: '',
    national_id: '',
    farm_type: '',
    crop: '',
    location: '',
  });
  const [token, setToken] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then((value) => {
      if (value) {
        setToken(value);
        fetchData(value);
      }
    });
    checkAndSyncOfflineData();
  }, []);

  const fetchData = async (token) => {
    try {
      const [cropsResponse, farmTypesResponse, farmersResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/crop/', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:8000/api/farmtype/', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:8000/api/farmers/', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCrops(cropsResponse.data);
      setFarmTypes(farmTypesResponse.data);
      setFarmers(farmersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data.');
    }
  };

  const handleSubmit = async () => {
    const isConnected = (await NetInfo.fetch()).isConnected;
    if (isConnected) {
      try {
        await axios.post('http://127.0.0.1:8000/api/farmers/', farmerData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Success', 'Farmer data submitted successfully');
        setIsModalVisible(false);
        fetchData(token);
      } catch (error) {
        console.error('Error submitting data:', error);
        Alert.alert('Error', 'Failed to submit data.');
      }
    } else {
      try {
        const offlineData = JSON.parse(await AsyncStorage.getItem('offlineFarmers')) || [];
        offlineData.push(farmerData);
        await AsyncStorage.setItem('offlineFarmers', JSON.stringify(offlineData));
        Alert.alert('Offline', 'Data saved locally and will sync when online.');
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error saving offline data:', error);
      }
    }
  };

  const checkAndSyncOfflineData = async () => {
    const isConnected = (await NetInfo.fetch()).isConnected;
    if (isConnected) {
      try {
        const offlineData = JSON.parse(await AsyncStorage.getItem('offlineFarmers')) || [];
        for (const farmer of offlineData) {
          await axios.post('http://127.0.0.1:8000/api/farmers/', farmer, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        await AsyncStorage.removeItem('offlineFarmers');
        fetchData(token);
      } catch (error) {
        console.error('Error syncing offline data:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Add Farmer" onPress={() => setIsModalVisible(true)} />
      <FlatList
        data={farmers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.farmer_name}</Text>
            <Text>{item.location}</Text>
            <Text>{item.national_id}</Text>
          </View>
        )}
      />
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Farmer Name"
            style={styles.input}
            value={farmerData.farmer_name}
            onChangeText={(text) => setFarmerData({ ...farmerData, farmer_name: text })}
          />
          <TextInput
            placeholder="National ID"
            style={styles.input}
            value={farmerData.national_id}
            onChangeText={(text) => setFarmerData({ ...farmerData, national_id: text })}
          />
          <TextInput
            placeholder="Location"
            style={styles.input}
            value={farmerData.location}
            onChangeText={(text) => setFarmerData({ ...farmerData, location: text })}
          />
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Close" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
  modalContent: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});

export default ClerkFormScreen;
