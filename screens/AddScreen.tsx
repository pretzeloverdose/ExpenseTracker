import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Search from '../components/Search';
import { EventsData, Item } from '../types/Item';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import loadFromStorage from '../storage';
import { setAllItems, addItem } from '../slice';
import ItemForm from '../components/ItemForm';
import { format } from 'date-fns';

type EditcreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Add'
>;

type Props = NativeStackScreenProps<RootStackParamList, 'Add'>;

const AddScreen: React.FC<Props > = ({ route }) => {
  const { eventsData } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Record<string, Item[]>>({});

  const fetchData = async () => {
    const storedData = await loadFromStorage();
    dispatch(setAllItems(storedData));
    setData(storedData);
  };

  const addItemFromScreen = (item: Item) => {
    dispatch(addItem(item));
    fetchData();
    navigation.goBack();
  }

  const today = new Date();
  const selectedDayString = format(today?.toString(), 'yyyy-MM-dd');
  
  return (
    <View style={{ flex: 1, paddingBottom: 80 }}>
      <ItemForm 
        editItem={undefined} 
        defaultDay={selectedDayString} 
        onSave={(item) => addItemFromScreen(item) } 
          onCancel={navigation.goBack}
      />
    </View>
  );
};

export default AddScreen;