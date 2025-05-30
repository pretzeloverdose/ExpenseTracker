/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
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

  return (
    <Provider store={store}>
      <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home', headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="Edit" component={EditScreen} options={{ title: 'Edit Item', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="Add" component={AddScreen} options={{ title: 'Add Item', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Edit Categories', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="CustomiseTheme" component={CustomizeThemeScreen} options={{ title: 'Customise Theme', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="MonthlySummary" component={SummaryScreen} options={{ title: 'Monthly Summary', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms and Conditions', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="SecureAccess" component={SecureAccessScreen} options={{ title: 'Secure Access', headerBackVisible: true, headerLeft: () => <View style={{ width: 20 }} />, headerTitleStyle: styles.headerTitle }} />
        </Stack.Navigator>
      </NavigationContainer>
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
