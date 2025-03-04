import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { login } from '../utils/api';
import { storeData, getData } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import jwtDecode from 'jwt-decode';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      const decoded = jwtDecode(response.data.access);
      const { role } = decoded;
      await storeData('userRole', role);
      await storeData('userToken', response.data.access);

      if (role === 'clerk') {
        navigation.navigate('ClerkForm');
      } else if (role === 'admin') {
        navigation.navigate('AdminConfig');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials.');
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