import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import FormInput from '../components/FormInput';
import { getFarmTypes, getCrops, submitFarmerData, storeOfflineData, getOfflineData, syncFarmerData } from '../utils/api';
import { getData } from '../utils/storage';
import * as Network from 'expo-network';
import SelectDropdown from 'react-native-select-dropdown';

const ClerkFormScreen = () => {
  const [farmTypes, setFarmTypes] = useState([]);
  const [crops, setCrops] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    fetchData();
    checkNetwork();
    const interval = setInterval(checkNetwork, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkNetwork = async () => {
    const { isInternetReachable } = await Network.getNetworkStateAsync();
    setIsConnected(isInternetReachable);
    if (isInternetReachable) {
      syncOfflineData();
    }
  };

  const syncOfflineData = async () => {
    const offlineData = await getOfflineData();
    if (offlineData.length > 0) {
      try {
        await syncFarmerData(offlineData);
        Alert.alert("Sync successful");
      } catch (e) {
        console.log("Error syncing", e);
      }
    }
  };

  const fetchData = async () => {
    try {
      const farmTypesResponse = await getFarmTypes();
      setFarmTypes(farmTypesResponse.data.map(item => item.name)); // Assuming 'name' field
      const cropsResponse = await getCrops();
      setCrops(cropsResponse.data.map(item => item.name)); // Assuming 'name' field
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validationSchema = Yup.object().shape({
    farmerName: Yup.string().required('Farmer Name is required'),
    nationId: Yup.string().required('Nation ID is required'),
    farmType: Yup.string().required('Farm Type is required'),
    crop: Yup.string().required('Crop is required'),
    location: Yup.string().required('Location is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (isConnected) {
        await submitFarmerData(values);
        Alert.alert('Success', 'Data submitted successfully!');
        resetForm();
      } else {
        await storeOfflineData(values);
        Alert.alert('Offline', 'Data saved offline. Will sync when online.');
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit data.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          farmerName: '',
          nationId: '',
          farmType: '',
          crop: '',
          location: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <FormInput
              label="Farmer's Name"
              onChangeText={handleChange('farmerName')}
              onBlur={handleBlur('farmerName')}
              value={values.farmerName}
              error={touched.farmerName && errors.farmerName}
            />
            <FormInput
              label="Nation ID"
              onChangeText={handleChange('nationId')}
              onBlur={handleBlur('nationId')}
              value={values.nationId}
              error={touched.nationId && errors.nationId}
            />
            <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Farm Type</Text>
            <SelectDropdown
              data={farmTypes}
              onSelect={(selectedItem) => {
                handleChange('farmType')(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem;
              }}
              rowTextForSelection={(item) => {
                return item;
              }}
              defaultButtonText="Select Farm Type"
              buttonStyle={styles.dropdown}
              buttonTextStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownList}
            />
            {touched.farmType && errors.farmType && (
              <Text style={styles.error}>{errors.farmType}</Text>
            )}
            </View>
            <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Crop</Text>
            <SelectDropdown
              data={crops}
              onSelect={(selectedItem) => {
                handleChange('crop')(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem;
              }}
              rowTextForSelection={(item) => {
                return item;
              }}
              defaultButtonText="Select Crop"
              buttonStyle={styles.dropdown}
              buttonTextStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownList}
            />
            {touched.crop && errors.crop && (
              <Text style={styles.error}>{errors.crop}</Text>
            )}
            </View>
            <FormInput
              label="Location"
              onChangeText={handleChange('location')}
              onBlur={handleBlur('location')}
              value={values.location}
              error={touched.location && errors.location}
            />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dropdownContainer:{
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    backgroundColor: '#EFEFEF',
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownText:{
    fontSize:16,
  },
  dropdownList:{
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
});

export default ClerkFormScreen;