import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import WeekCalendar from '../components/WeekCalendar';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ route }) => {
    const eventsData = route?.params?.eventsData ?? {};
  return (
    <WeekCalendar eventsData={eventsData} />
  );
};

export default HomeScreen;