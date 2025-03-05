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
import axios from 'axios';

const ClerkFormScreen = () => {
  const [crops, setCrops] = useState([]);
  const [farmTypes, setFarmTypes] = useState([]);
  const [farmerData, setFarmerData] = useState({
    farmer_name: '',
    national_id: '',
    farm_type: '',
    crop: '',
    location: '',
  });
  const [farmers, setFarmers] = useState([])
  const [token, setToken] = useState(null);
  const [isFarmTypeDropdownVisible, setIsFarmTypeDropdownVisible] = useState(false);
  const [isCropDropdownVisible, setIsCropDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then((value) => {
      if (value) {
        setToken(value);
        fetchData(value);
        fetchFarmTypes(value);
        fetchFarmersData(value);
      }
    });
  }, []);

  const fetchData = async (token) => {
    try {
      const cropsResponse = await axios.get('http://127.0.0.1:8000/api/crop/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops(cropsResponse.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
      Alert.alert('Error', 'Failed to fetch crops.');
    }
  };

  const fetchFarmersData = async (token) => {
    try {
      const farmersResponse = await axios.get('http://127.0.0.1:8000/api/farmers/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(farmersResponse.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
      Alert.alert('Error', 'Failed to fetch farmerss.');
    }
  };

  const fetchFarmTypes = async (token) => {
    try {
      const farmTypesResponse = await axios.get('http://127.0.0.1:8000/api/farmtype/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmTypes(farmTypesResponse.data);
    } catch (error) {
      console.error('Error fetching farm types:', error);
      Alert.alert('Error', 'Failed to fetch farm types.');
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/farmers/', farmerData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Farmer data submitted successfully');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit data.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Add Farmer" onPress={() => setIsModalVisible(true)} />






      <View style={styles.tableContainer}>
  {/* Table Header */}
  <View style={styles.tableHeader}>
    <Text style={styles.headerCell}>Farmer Name</Text>
    <Text style={styles.headerCell}>Location</Text>
    <Text style={styles.headerCell}>National ID</Text>
  </View>

  {/* Table Data */}
  <FlatList
    data={farmers}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View style={styles.tableRow}>
        <Text style={styles.cell}>{item.farmer_name}</Text>
        <Text style={styles.cell}>{item.location}</Text>
        <Text style={styles.cell}>{item.national_id}</Text>
      </View>
    )}
  />
</View>

















      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.label}>Farmer Name</Text>
              <TextInput
                style={styles.input}
                value={farmerData.farmer_name}
                onChangeText={(text) => setFarmerData({ ...farmerData, farmer_name: text })}
              />

              <Text style={styles.label}>National ID</Text>
              <TextInput
                style={styles.input}
                value={farmerData.national_id}
                onChangeText={(text) => setFarmerData({ ...farmerData, national_id: text })}
              />

              <Text style={styles.label}>Farm Type</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setIsFarmTypeDropdownVisible(true)}>
                <Text>{farmerData.farm_type ? farmTypes.find(type => type.id === farmerData.farm_type)?.farm_type_name : 'Select Farm Type'}</Text>
              </TouchableOpacity>
              <Modal visible={isFarmTypeDropdownVisible} animationType="slide" transparent>
                <TouchableOpacity style={styles.modalBackground} onPress={() => setIsFarmTypeDropdownVisible(false)}>
                  <View style={styles.modalContent}>
                    <ScrollView>
                      {farmTypes.map((farmType) => (
                        <TouchableOpacity
                          key={farmType.id}
                          style={styles.modalItem}
                          onPress={() => {
                            setFarmerData({ ...farmerData, farm_type: farmType.id });
                            setIsFarmTypeDropdownVisible(false);
                          }}
                        >
                          <Text>{farmType.farm_type_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              </Modal>

              <Text style={styles.label}>Crop</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setIsCropDropdownVisible(true)}>
                <Text>{farmerData.crop ? crops.find(crop => crop.id === farmerData.crop)?.crop_name : 'Select Crop'}</Text>
              </TouchableOpacity>
              <Modal visible={isCropDropdownVisible} animationType="slide" transparent>
                <TouchableOpacity style={styles.modalBackground} onPress={() => setIsCropDropdownVisible(false)}>
                  <View style={styles.modalContent}>
                    <ScrollView>
                      {crops.map((crop) => (
                        <TouchableOpacity
                          key={crop.id}
                          style={styles.modalItem}
                          onPress={() => {
                            setFarmerData({ ...farmerData, crop: crop.id });
                            setIsCropDropdownVisible(false);
                          }}
                        >
                          <Text>{crop.crop_name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              </Modal>

              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={farmerData.location}
                onChangeText={(text) => setFarmerData({ ...farmerData, location: text })}
              />

              <Button title="Submit" onPress={handleSubmit} />
              <Button title="Close" onPress={() => setIsModalVisible(false)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#EFEFEF',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#EFEFEF',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#bbb',
  },
  
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  
});

export default ClerkFormScreen;
