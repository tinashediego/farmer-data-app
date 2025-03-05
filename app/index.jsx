import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useRouter } from 'expo-router'; // Import useRouter
import axios from 'axios'; // Import axios
import { jwtDecode } from "jwt-decode";


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', { // Replace with your API endpoint
        email: email,
        password: password,
      });
      // Assuming your backend returns a token in the response data
      const token = response.data.access; //adjust to your response data.

      if (token) {
        await AsyncStorage.setItem('userToken', token);
        const decoded = jwtDecode(token);
        console.log(decoded);

        axios.get(`http://127.0.0.1:8000/api/auth/user/${decoded.user_id}/`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then((response) => {
          console.log(response.data);
          AsyncStorage.setItem('user', JSON.stringify(response.data));
          AsyncStorage.setItem('userRole', JSON.stringify(response.data.role));

          if(response.data.role === 'admin'){
            router.push('/adminconfig');
          }
          else{
            router.push('/clerkform'); // Redirect to home screen
        }}
        )
        .catch((error) => {
          console.error('Error:', error);
          Alert.alert('Login Failed', 'An unexpected error occurred.');
        }
        );
        router.push('/homescreen');
      } else {
        Alert.alert('Login Failed', 'Token not received from server.');
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server Error:', error.response.data);
        Alert.alert('Login Failed', error.response.data.message || 'Invalid credentials.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network Error:', error.request);
        Alert.alert('Login Failed', 'Network error. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
        Alert.alert('Login Failed', 'An unexpected error occurred.');
      }
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