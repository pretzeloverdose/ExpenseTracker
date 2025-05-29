import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Search from '../components/Search';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const SearchScreen: React.FC<Props > = ({ route }) => {
    const eventsData = route?.params?.eventsData ?? {};

  return (
    <Search eventsData={eventsData} />
  );
};

export default SearchScreen;