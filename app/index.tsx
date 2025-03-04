// App.js
import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/LoginScreen';
import ClerkFormScreen from '@/screens/ClerkFormScreen';
import AdminConfigScreen from '@/screens/AdminConfigScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function Index() {
  const [initialRouteName, setInitialRouteName] = useState('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userRole = await AsyncStorage.getItem('userRole');

        if (userToken) {
          if (userRole === 'clerk') {
            setInitialRouteName('ClerkForm');
          } else if (userRole === 'admin') {
            setInitialRouteName('AdminConfig');
          }
        }
      } catch (error) {
        console.error('Error checking user login:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLogin();
  }, []);

  if (loading) {
    return null; // or a loading indicator
  }

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ClerkForm" component={ClerkFormScreen} />
      <Stack.Screen name="AdminConfig" component={AdminConfigScreen} />
    </Stack.Navigator>
  );
}
