import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { EventsData, Item } from "../types/Item";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import loadFromStorage from '../storage';
import { setAllItems, updateItem, deleteItem } from '../slice';
import ItemForm from './ItemForm';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { confirmDelete } from '../confirm';
import { format, parse } from 'date-fns';
import globalStyles, { createGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';

interface SearchComponentProps {
  eventsData: EventsData;
}

const Search: React.FC<SearchComponentProps> = ({ eventsData }) => {
  const reduxItems = useAppSelector((state) => state.items.items);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Item[]>([]);
  const [query, setQuery] = useState('');
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const [selectedDayString, setSelectedDayString] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { primaryColor } = useTheme();
  const globalStyles = createGlobalStyles(primaryColor);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = await loadFromStorage();
      dispatch(setAllItems(storedData));
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
  const allItems = Object.values(reduxItems).flat();

  const sorted = allItems.sort((a, b) => {
    const dateA = new Date(a.day).getTime();
    const dateB = new Date(b.day).getTime();

    if (dateA === dateB) {
      return a.id - b.id;
    }
    return dateA - dateB;
  });

  setData(sorted);
}, [reduxItems]);

  const filtered = data.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const openEdit = (item: Item) => {
    console.log("A");
    setEditVisible(true);
    setSelectedDayString(item.day);
    setEditingItem(item);
  }

  const deleteItemClick = async(item: Item) => {
    const confirmed = await confirmDelete();
    if (confirmed) {
      dispatch(deleteItem(item));
    }
  }

  const closeEdit = () => {
    setEditVisible(false);
  }

  const handleUpdate = (item: Item) => {
    console.log(item);
    dispatch(updateItem(item));
    closeEdit();
  }

  function formatDate(dateString: string) {
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return format(date, 'do MMMM yyyy');
  }

  return (
    <View style={globalStyles.container}>
      <View style={{ flexDirection: 'row'}}>
      <TextInput
        placeholder="Search..."
        style={globalStyles.input}
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Add', {eventsData})} style={[globalStyles.navigationBtn, globalStyles.iconButton]}>
        <Icon name="add" size={18} color="#fff" /><Text style={globalStyles.navText}> Add Item</Text>
      </TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          
          return (
          <View style={globalStyles.item}>
            <View style={globalStyles.row}>
              <View style={globalStyles.leftCol}>
                <TouchableOpacity onPress={() => navigation.navigate('Edit', { selectedItem: item, eventsData })}>
                  <Text style={globalStyles.name}>{formatDate(item.day)} - {item.name}</Text>
                </TouchableOpacity>
              </View>
              <View style={globalStyles.rightCol}>
                <Text style={[globalStyles.amount, { color: item.color }]}>${item.amount}</Text>
                <TouchableOpacity onPress={() => deleteItemClick(item)}>
                  <Text style={globalStyles.delete}><Icon name="delete" /> Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          )}}
      />
      {editVisible && (
        <Modal visible={editVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}>
        <ItemForm 
          editItem={editingItem} 
          defaultDay={selectedDayString} 
          onSave={(item) => { handleUpdate(item); }} 
          onCancel={closeEdit} 
        />
        </View>
        </Modal>
      )}
    </View>
  );
}


export default Search;