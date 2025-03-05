import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AdminConfigScreen = () => {
  const [crops, setCrops] = useState([]);
  const [farmTypes, setFarmTypes] = useState([]);

  const [token, setToken] = useState(null);
  const [isCropModalVisible, setIsCropModalVisible] = useState(false);
  const [isFarmTypeModalVisible, setIsFarmTypeModalVisible] = useState(false);

  const [cropData, setCropData] = useState({ crop_name: '' });
  const [farmTypeData, setFarmTypeData] = useState({ farm_type_name: '' });

  useEffect(() => {
    AsyncStorage.getItem('userToken').then((value) => {
      if (value) {
        setToken(value);
        handleFetchCrop(value);
        handleFetchFarmType(value);
      }
    });
  }, []);

  const handleSubmitCrop = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/crop/', cropData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Crop added successfully');
      setIsCropModalVisible(false);
      setCropData({ crop_name: '' });
      handleFetchCrop(token);
    } catch (error) {
      console.error('Error adding crop:', error);
      Alert.alert('Error', 'Failed to add crop.');
    }
  };

  const handleSubmitFarmType = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/farmtype/', farmTypeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Farm type added successfully');
      setIsFarmTypeModalVisible(false);
      setFarmTypeData({ farm_type_name: '' });
      handleFetchFarmType(token);
    } catch (error) {
      console.error('Error adding farm type:', error);
      Alert.alert('Error', 'Failed to add farm type.');
    }
  };

  const handleFetchCrop = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/crop/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
      Alert.alert('Error', 'Failed to fetch crops.');
    }
  };

  const handleFetchFarmType = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/farmtype/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmTypes(response.data);
    } catch (error) {
      console.error('Error fetching farmtypes:', error);
      Alert.alert('Error', 'Failed to fetch farmtypes.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={() => setIsCropModalVisible(true)}>
          <Text style={styles.buttonText}>Add Crops</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={() => setIsFarmTypeModalVisible(true)}>
          <Text style={styles.buttonText}>Add Farm Types</Text>
        </TouchableOpacity>
      </View>

      {/* Crop Modal */}
      <Modal visible={isCropModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Crop</Text>
            <TextInput
              style={styles.input}
              value={cropData.crop_name}
              placeholder="Enter Crop Name"
              onChangeText={(text) => setCropData({ ...cropData, crop_name: text })}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={handleSubmitCrop}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.redButton]} onPress={() => setIsCropModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Farm Type Modal */}
      <Modal visible={isFarmTypeModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Farm Type</Text>
            <TextInput
              style={styles.input}
              value={farmTypeData.farm_type_name}
              placeholder="Enter Farm Type"
              onChangeText={(text) => setFarmTypeData({ ...farmTypeData, farm_type_name: text })}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={handleSubmitFarmType}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.redButton]} onPress={() => setIsFarmTypeModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Crop Table */}
      <Text style={styles.sectionTitle}>Crops</Text>
      <FlatList
        data={crops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.crop_name}</Text>
          </View>
        )}
      />

      {/* Farm Types Table */}
      <Text style={styles.sectionTitle}>Farm Types</Text>
      <FlatList
        data={farmTypes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.farm_type_name}</Text>
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },

  button: { padding: 12, borderRadius: 8, alignItems: 'center', width: '45%' },
  greenButton: { backgroundColor: '#28a745' },
  blueButton: { backgroundColor: '#007bff' },
  redButton: { backgroundColor: '#dc3545' },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },

  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  cell: { flex: 1, textAlign: 'center' },
});

export default AdminConfigScreen;
