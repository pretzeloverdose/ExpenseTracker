import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';
import globalStyles, { createGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rnBiometrics = new ReactNativeBiometrics();

const AUTH_METHOD_KEY = 'authMethod';

type AuthProps = {
  onAuthSuccess?: () => void;
  forceAuth?: boolean;
};

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, forceAuth }) => {
  const { primaryColor } = useTheme();
  const globalStyles = createGlobalStyles(primaryColor);

  const [authType, setAuthType] = useState<'none' | 'pin' | 'fingerprint'>('none');
  const [pin, setPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [isPinSet, setIsPinSet] = useState(false);

  // Load saved method on mount
  React.useEffect(() => {
    (async () => {
      const storedMethod = await AsyncStorage.getItem(AUTH_METHOD_KEY);
      if (storedMethod === 'pin' || storedMethod === 'fingerprint' || storedMethod === 'none') {
        setAuthType(storedMethod);
      }
    })();
  }, []);

  // Save method when changed
  const handleSetAuthType = async (type: 'none' | 'pin' | 'fingerprint') => {
    setAuthType(type);
    await AsyncStorage.setItem(AUTH_METHOD_KEY, type);
  };

  // Save PIN securely
  const savePin = async (pin: string) => {
    await Keychain.setGenericPassword('user', pin);
    setIsPinSet(true);
    Alert.alert('PIN set!');
  };

  // PIN check
  const checkPin = async () => {
    const creds = await Keychain.getGenericPassword();
    if (creds && creds.password === enteredPin) {
      Alert.alert('PIN correct!');
      onAuthSuccess && onAuthSuccess();
    } else {
      Alert.alert('Incorrect PIN');
    }
  };

  // Biometrics auth
  const handleBiometrics = async () => {
    const { available } = await rnBiometrics.isSensorAvailable();
    if (!available) {
      Alert.alert('Biometric authentication not available');
      return;
    }
    rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint or face' })
      .then(resultObject => {
        const { success } = resultObject;
        if (success) {
          Alert.alert('Biometric authenticated!');
          onAuthSuccess && onAuthSuccess();
        } else {
          Alert.alert('Biometric authentication cancelled');
        }
      })
      .catch(() => {
        Alert.alert('Biometric authentication failed');
      });
  };

  // Optionally, if forceAuth is true, only show the relevant auth UI (not the method selection)
  if (forceAuth) {
    if (authType === 'pin') {
      return (
        <View style={globalStyles.container}>
          <TextInput
            placeholder="Enter PIN"
            secureTextEntry
            value={enteredPin}
            onChangeText={setEnteredPin}
            style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
            keyboardType="number-pad"
          />
          <TouchableOpacity onPress={checkPin}>
            <Text style={{ color: primaryColor }}>Verify PIN</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (authType === 'fingerprint') {
      return (
        <View style={globalStyles.container}>
          <TouchableOpacity onPress={handleBiometrics} style={{ marginTop: 16 }}>
            <Text style={{ color: primaryColor }}>Scan Fingerprint/Face</Text>
          </TouchableOpacity>
        </View>
      );
    }
    // If no authType, fallback
    return null;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Choose Authorisation Method:</Text>
      <TouchableOpacity onPress={() => handleSetAuthType('none')} style={{ marginBottom: 8 }}>
        <Text style={{ color: authType === 'none' ? primaryColor : '#000' }}>No Authorisation</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSetAuthType('pin')} style={{ marginBottom: 8 }}>
        <Text style={{ color: authType === 'pin' ? primaryColor : '#000' }}>PIN Authorisation</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSetAuthType('fingerprint')} style={{ marginBottom: 16 }}>
        <Text style={{ color: authType === 'fingerprint' ? primaryColor : '#000' }}>Fingerprint/Face Authorisation</Text>
      </TouchableOpacity>

      {authType === 'pin' && !isPinSet && (
        <>
          <TextInput
            placeholder="Set a PIN"
            secureTextEntry
            value={pin}
            onChangeText={setPin}
            style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
            keyboardType="number-pad"
          />
          <TouchableOpacity onPress={() => savePin(pin)} style={{ marginBottom: 16 }}>
            <Text style={{ color: primaryColor }}>Save PIN</Text>
          </TouchableOpacity>
        </>
      )}

      {authType === 'pin' && isPinSet && (
        <>
          <TextInput
            placeholder="Enter PIN"
            secureTextEntry
            value={enteredPin}
            onChangeText={setEnteredPin}
            style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
            keyboardType="number-pad"
          />
          <TouchableOpacity onPress={checkPin}>
            <Text style={{ color: primaryColor }}>Verify PIN</Text>
          </TouchableOpacity>
        </>
      )}

      {authType === 'fingerprint' && (
        <TouchableOpacity onPress={handleBiometrics} style={{ marginTop: 16 }}>
          <Text style={{ color: primaryColor }}>Scan Fingerprint/Face</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Auth;