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

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row'}}>
      <TextInput
        placeholder="Search..."
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Add', {eventsData})} style={[styles.navigationBtn, styles.iconButton]}>
        <Icon name="add" size={18} color="#fff" /><Text style={styles.navText}> Add Item</Text>
      </TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.row}>
              <View style={styles.leftCol}>
                <TouchableOpacity onPress={() => navigation.navigate('Edit', { selectedItem: item, eventsData })}>
                  <Text style={styles.name}>{item.day.toString()} - {item.name}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rightCol}>
                <Text style={[styles.amount, { color: item.color }]}>${item.amount}</Text>
                <TouchableOpacity onPress={() => deleteItemClick(item)}>
                  <Text style={styles.delete}><Icon name="delete" /> Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    height: 43,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 6
  },
  navigationBtn: {
        padding: 12,
        backgroundColor: '#1a4060',
        borderRadius: 5,
        marginRight: 6,
        marginLeft: 6,
        marginBottom: 12,
        margin: 0,
        flex: 3
    },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a4060',
    borderRadius: 8,
    color: '#fff'
  },
  item: {
  padding: 12,
  borderRadius: 12,
  marginBottom: 8,
  backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },

  leftCol: {
    flex: 1,
    flexShrink: 1,
  },

  rightCol: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },

  name: {
    color: '#444',
    flexWrap: 'wrap',
  },

  amount: {
    color: '#444',
    fontWeight: 'bold',
  },

  delete: {
    marginTop: 4,
    color: 'red',
  },
    navText: {
        color: '#fff'
    },

});


export default Search;