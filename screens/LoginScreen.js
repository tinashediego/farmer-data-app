import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { login } from '../utils/api';
import { storeData, getData } from '../utils/storage'; // Import getData
import { useRouter } from "expo-router";
import jwtDecode from 'jwt-decode'; // Correct import
import { useNavigation } from '@react-navigation/native'; // Correct navigation import

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const navigation = useNavigation(); // Get navigation object

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      console.log(response);
      const decoded = jwtDecode(response.data.access); // Correct variable name
      const { role } = decoded;
      console.log(role);
      await storeData('userRole', role);
      await storeData('userToken', response.data.access);

      let userRole = await getData('userRole'); // Get role from storage

      if (userRole === 'clerk') {
        navigation.navigate('ClerkForm'); // Correct navigation
      } else if (userRole === 'admin') {
        navigation.navigate('AdminConfig'); // Correct navigation
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'An error occurred'); // Better error handling
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;