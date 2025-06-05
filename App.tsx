/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import EditScreen from './screens/EditScreen';
import AddScreen from './screens/AddScreen';
import { RootStackParamList } from './types/navigation';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import CustomizeThemeScreen from './screens/CustomizeThemeScreen';
import SummaryScreen from './screens/SummaryScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import TermsScreen from './screens/TermsScreen';
import SecureAccessScreen from './screens/SecureAccessScreen';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth from './components/Auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  const sampleData = [
    { 'id': 1, 'description': 'item 1', 'date': '2025-05-13' },
    { 'id': 2, 'description': 'item 2', 'date': '2025-05-14' },
    { 'id': 3, 'description': 'item 3', 'date': '2025-05-15' },
    { 'id': 4, 'description': 'item 4', 'date': '2025-05-16' },
    { 'id': 5, 'description': 'item 5', 'date': '2025-05-17' },
    { 'id': 6, 'description': 'item 6', 'date': '2025-05-13' },
  ]

  enableScreens();

  const [authRequired, setAuthRequired] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const method = await AsyncStorage.getItem('authMethod');
      if (method === 'pin' || method === 'fingerprint') {
        setAuthRequired(true);
      } else {
        setAuthRequired(false);
      }
    })();
  }, []);

  const handleAuthSuccess = () => setAuthRequired(false);

  useEffect(() => {

    // Prompt for notification permission on Android 13+ and iOS
    async function requestNotificationPermission() {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus >= 1) {
        // Permission granted, create channel if needed
        await notifee.createChannel({
          id: 'your-channel-id',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      } else {
        // Permission denied
        console.log('Notification permission denied');
      }
    }
    requestNotificationPermission();
  }, []);

  if (authRequired === null) {
    // Still loading
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        {/* Show Auth modal if authentication is required */}
        <Modal visible={authRequired} animationType="slide" transparent={false}>
          <Auth onAuthSuccess={handleAuthSuccess} forceAuth />
        </Modal>
        {/* Main app UI */}
        {!authRequired && (
          <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home', headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
              <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
              <Stack.Screen name="Edit" component={EditScreen} options={{ title: 'Edit Item', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
              <Stack.Screen name="Add" component={AddScreen} options={{ title: 'Add Item', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
              <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Edit Categories', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
              <Stack.Screen name="CustomiseTheme" component={CustomizeThemeScreen} options={{ title: 'Customise Theme', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
              <Stack.Screen name="MonthlySummary" component={SummaryScreen} options={{ title: 'Monthly Summary', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
              <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms and Conditions', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
              <Stack.Screen name="SecureAccess" component={SecureAccessScreen} options={{ title: 'Secure Access', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  headerTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'semibold',
  }
});

export default App;
