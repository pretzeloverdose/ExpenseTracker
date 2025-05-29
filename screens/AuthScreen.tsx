import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Keychain from 'react-native-keychain';

const AuthScreen = () => {
  const [biometricType, setBiometricType] = useState(null);
  const [pin, setPin] = useState('');
  const [usePin, setUsePin] = useState(false);

  

  return (
    <View style={styles.container}>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  switchText: {
    color: '#007AFF',
    marginTop: 10,
  },
});

export default AuthScreen;