import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { EventsData } from '../types/Item';
import globalStyles, { createGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home',
  'Search'
>;

interface MenuComponentProps {
  eventsData: EventsData;
  onItemHighlight: (id: number) => void;
}

const MenuComponent: React.FC<MenuComponentProps> = ({ eventsData, onItemHighlight }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { primaryColor } = useTheme();
  const globalStyles = createGlobalStyles(primaryColor);

    return (
        <GestureHandlerRootView>
        <ScrollView style={{ flex: 1, flexDirection: 'column', padding: 20, backgroundColor: '#fff', borderRadius: 10, marginBottom: 0 }}>
            <View style={globalStyles.menuNavigation}>
                <TouchableOpacity 
  onPress={() => navigation.navigate('Search', { eventsData })} 
  style={[globalStyles.menuNavigationBtn, { flexDirection: 'row', alignItems: 'center' }]}>
  <MaterialIcons name="search" size={20} color="white" style={{ marginRight: 10 }} />
  <Text style={[globalStyles.whiteText]}>Search Items</Text>
</TouchableOpacity>

<TouchableOpacity 
  onPress={() => navigation.navigate('Notifications', { eventsData })}
  style={[globalStyles.menuNavigationBtn, { flexDirection: 'row', alignItems: 'center' }]}>
  <MaterialIcons name="notifications" size={20} color="white" style={{ marginRight: 10 }} />
  <Text style={[globalStyles.whiteText]}>Notifications</Text>
</TouchableOpacity>

<TouchableOpacity 
  onPress={() => navigation.navigate('Categories', { eventsData })} 
  style={[globalStyles.menuNavigationBtn, { flexDirection: 'row', alignItems: 'center' }]}>
  <MaterialIcons name="category" size={20} color="white" style={{ marginRight: 10 }} />
  <Text style={[globalStyles.whiteText]}>Edit Categories</Text>
</TouchableOpacity>

<TouchableOpacity 
  onPress={() => navigation.navigate('MonthlySummary', { eventsData })} 
  style={[globalStyles.menuNavigationBtn, { flexDirection: 'row', alignItems: 'center' }]}>
  <MaterialIcons name="calendar-today" size={20} color="white" style={{ marginRight: 10 }} />
  <Text style={[globalStyles.whiteText]}>Monthly Summary</Text>
</TouchableOpacity>

<TouchableOpacity 
  onPress={() => navigation.navigate('CustomiseTheme')} 
  style={[globalStyles.menuNavigationBtn, { flexDirection: 'row', alignItems: 'center' }]}>
  <MaterialIcons name="palette" size={20} color="white" style={{ marginRight: 10 }} />
  <Text style={[globalStyles.whiteText]}>Customise Theme</Text>
</TouchableOpacity>

<TouchableOpacity 
  style={[globalStyles.menuNavigationBtn, { flexDirection: 'row', alignItems: 'center' }]}>
  <MaterialIcons name="security" size={20} color="white" style={{ marginRight: 10 }} />
  <Text style={[globalStyles.whiteText]}>Secure Access</Text>
</TouchableOpacity>

<TouchableOpacity 
  onPress={() => navigation.navigate('Terms')} 
  style={[globalStyles.menuNavigationBtn, { flexDirection: 'row', alignItems: 'center' }]}>
  <MaterialIcons name="description" size={20} color="white" style={{ marginRight: 10 }} />
  <Text style={[globalStyles.whiteText]}>Terms and Conditions</Text>
</TouchableOpacity>

<TouchableOpacity 
  style={[globalStyles.menuNavigationBtn, { flexDirection: 'row', alignItems: 'center' }]}>
  <MaterialIcons name="block" size={20} color="white" style={{ marginRight: 10 }} />
  <Text style={[globalStyles.whiteText]}>Remove Advertisements</Text>
</TouchableOpacity>
            </View>
        </ScrollView>
        </GestureHandlerRootView>
    )
}
export default MenuComponent;