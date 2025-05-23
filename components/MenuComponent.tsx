import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { EventsData } from '../types/Item';

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

    return (
        <GestureHandlerRootView>
        <ScrollView style={{ flex: 1, flexDirection: 'column', padding: 20, backgroundColor: '#fff', borderRadius: 10, marginBottom: 0 }}>
            <View style={styles.navigation}>
                <TouchableOpacity onPress={() => navigation.navigate('Search', { eventsData })} style={styles.navigationBtn}><Text style={[styles.whiteText, styles.centerText]}>Search Items</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navigationBtn}><Text style={[styles.whiteText, styles.centerText]}>Edit Categories</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navigationBtn}><Text style={[styles.whiteText, styles.centerText]}>Monthly Summary</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navigationBtn}><Text style={[styles.whiteText, styles.centerText]}>Customise Theme</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navigationBtn}><Text style={[styles.whiteText, styles.centerText]}>Secure Access</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navigationBtn}><Text style={[styles.whiteText, styles.centerText]}>Terms and Conditions</Text></TouchableOpacity>
            </View>
        </ScrollView>
        </GestureHandlerRootView>
    )
}
const styles = StyleSheet.create({
    navigation: {
        paddingTop: 10,
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navigationBtn: {
        padding: 12,
        backgroundColor: '#1a4060',
        borderRadius: 5,
        marginBottom: 8,
        width: 240
    },
    whiteText: {
        color: '#fff'
    },
    centerText: {
        textAlign: 'center'
    }
    }
);
export default MenuComponent;