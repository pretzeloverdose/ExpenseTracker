import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Alert, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Auth from '../components/Auth';

type Props = NativeStackScreenProps<RootStackParamList, 'SecureAccess'>;

const SecureAccessScreen: React.FC<Props > = ({ route }) => {

    return (
        <Auth />
    )
}
export default SecureAccessScreen;