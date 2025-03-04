import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { login } from '../utils/api';
import { storeData } from '../utils/storage';
import { useRouter } from "expo-router";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      console.log(response);
      await storeData('userToken', response.data.token);
      await storeData('userRole', response.data.role);

      if (response.data.role === 'clerk') {
        navigation.navigate('/ClerkForm');
      } else if (response.data.role === 'admin') {
        navigation.navigate('/AdminConfig');
      }
    } catch (error) {r
      Alert.alert('Login Failed', error);
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