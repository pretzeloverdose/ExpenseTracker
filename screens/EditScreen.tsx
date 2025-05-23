import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Search from '../components/Search';
import { EventsData, Item } from '../types/Item';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import loadFromStorage from '../storage';
import { setAllItems, updateItem } from '../slice';
import ItemForm from '../components/ItemForm';

type EditcreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Edit'
>;

type Props = NativeStackScreenProps<RootStackParamList, 'Edit'>;

const EditScreen: React.FC<Props > = ({ route }) => {
    const { selectedItem, eventsData } = route.params;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const [data, setData] = useState<Record<string, Item[]>>({});

    const fetchData = async () => {
      const storedData = await loadFromStorage();
      dispatch(setAllItems(storedData));
      setData(storedData);
    };

    const handleUpdate = (updatedItem: Item) => {
        dispatch(updateItem(updatedItem));
        fetchData();
        navigation.goBack();
    };

  return (
    <View style={{ flex: 1 }}>
        <ItemForm editItem={selectedItem} defaultDay={selectedItem.day} onSave={handleUpdate} onCancel={navigation.goBack} />
    </View>
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

export default EditScreen;