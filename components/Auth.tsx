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
      Alert.alert('Authentication not available');
      return;
    }
    rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint or face' })
      .then(resultObject => {
        const { success } = resultObject;
        if (success) {
          Alert.alert('Authenticated!');
          onAuthSuccess && onAuthSuccess();
        } else {
          Alert.alert('Authentication cancelled');
        }
      })
      .catch(() => {
        Alert.alert('Authentication failed');
      });
  };

  // Optionally, if forceAuth is true, only show the relevant auth UI (not the method selection)
  if (forceAuth) {
    if (authType === 'pin') {
      return (
        <View testID="auth-modal" style={globalStyles.container}>
          <View style={[globalStyles.menuNavigation, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>Authorisation Required</Text>
            <TextInput
              placeholder="Enter PIN"
              secureTextEntry
              value={enteredPin}
              onChangeText={setEnteredPin}
              style={{ borderWidth: 1, marginBottom: 18, padding: 8 }}
              keyboardType="number-pad"
            />
            <TouchableOpacity onPress={checkPin} style={ globalStyles.menuNavigationBtn }>
            <Text style={ [ globalStyles.whiteText, { textAlign: 'center'} ]}>Verify PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (authType === 'fingerprint') {
      return (
        <View testID="auth-modal" style={globalStyles.container}>
          <View style={[globalStyles.menuNavigation, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>Authorisation Required</Text>
            <TouchableOpacity onPress={handleBiometrics} style={ globalStyles.menuNavigationBtn }>
            <Text style={ [ globalStyles.whiteText, { textAlign: 'center'} ]}>Scan Fingerprint/Face</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    // If no authType, fallback
    return null;
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.menuNavigation}>
        <Text style={{ fontSize: 18, marginBottom: 16 }}>Choose Authorisation Method:</Text>
        <TouchableOpacity onPress={() => handleSetAuthType('none')} style={ globalStyles.menuNavigationBtn }>
          <Text style={ [ globalStyles.whiteText, { textAlign: 'center'} ]}>No Authorisation{authType == 'none' ? ' (selected)' : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSetAuthType('pin')} style={ globalStyles.menuNavigationBtn }>
          <Text style={ [ globalStyles.whiteText, { textAlign: 'center'} ]}>PIN Authorisation{authType == 'pin' ? ' (selected)' : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSetAuthType('fingerprint')} style={ globalStyles.menuNavigationBtn}>
          <Text style={ [ globalStyles.whiteText, { textAlign: 'center'} ]}>Fingerprint/Face Authorisation{authType == 'fingerprint' ? ' (selected)' : ''}</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.menuNavigation}>

      {authType === 'pin' && !isPinSet && (
        <>
          <TextInput
            placeholder="Set a PIN"
            secureTextEntry
            value={pin}
            onChangeText={setPin}
            style={{ borderWidth: 1, marginBottom: 18, padding: 8 }}
            keyboardType="number-pad"
          />
          <TouchableOpacity onPress={() => savePin(pin)} style={ globalStyles.menuNavigationBtn }>
          <Text style={ [ globalStyles.whiteText, { textAlign: 'center'} ]}>Save PIN</Text>
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
            style={{ borderWidth: 1, marginBottom: 18, padding: 8 }}
            keyboardType="number-pad"
          />
          <TouchableOpacity onPress={checkPin} style={ globalStyles.menuNavigationBtn }>
          <Text style={ [ globalStyles.whiteText, { textAlign: 'center'} ]}>Verify PIN</Text>
          </TouchableOpacity>
        </>
      )}

      {authType === 'fingerprint' && (
        <TouchableOpacity onPress={handleBiometrics} style={ globalStyles.menuNavigationBtn }>
          <Text style={ [ globalStyles.whiteText, { textAlign: 'center'} ]}>Scan Fingerprint/Face</Text>
        </TouchableOpacity>
      )}
    </View>
    </View>
  );
};

export default Auth;