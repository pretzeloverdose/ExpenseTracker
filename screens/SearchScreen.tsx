import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Search from '../components/Search';
import { EventsData, Item } from '../types/Item';
import { useNavigation } from '@react-navigation/native';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Search'
>;

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const SearchScreen: React.FC<Props > = ({ route }) => {
    const { eventsData } = route.params;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Search eventsData={eventsData} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SearchScreen;