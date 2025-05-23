import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from './types/Item';
import storage from './storage';
import _ from 'lodash';
import { Alert } from 'react-native';

const LOCAL_KEY = 'app_items';
const STORAGE_KEY = 'agendaData';
let confirmDeleteBool = false;

const loadFromStorage = async () => {
try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        console.log("a" + jsonValue);
        return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load agenda data:', e);
        return {};
    }
};

// Save data
export const saveAgendaData = async (data: Record<string, any[]>) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    console.log('Data saved successfully');
  } catch (e) {
    console.error('Failed to save agenda data:', e);
  }
};

type ItemsByDate = {
  [date: string]: Item[];
};

type ItemsState = {
  items: ItemsByDate;
};

const initialState: ItemsState = {
  items: {}, // default to empty object
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setAllItems(state, action: PayloadAction<ItemsByDate>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<Item>) {
      const item = action.payload;
      const { day } = item;
      
      if (!day) {
        console.warn('Cannot add item — missing day');
        return;
      }

      // Get all items from all days to calculate next ID
      const allItems = Object.values(state.items).flat();
      const nextId = Math.max(0, ...allItems.map(i => i.id)) + 1;

      if (!state.items[day]) {
        state.items[day] = [];
      }

      const newItem = {
        ...item,
        id: nextId,
        day // ensure day is included
      };

      state.items[day].push(newItem);
      saveAgendaData(state.items);
    },
    deleteItem(state, action: PayloadAction<{ day: string; id: number }>) {

      const { day, id } = action.payload;

      const filteredItems = state.items[day]?.filter(item => item.id !== id) || [];

      if (filteredItems.length > 0) {
        state.items[day] = filteredItems;
      } else {
        // Remove the key entirely if no items remain for that day
        state.items = _.omit(state.items, day);
      }

      saveAgendaData(state.items);
      confirmDeleteBool = false;
    },
    updateItem(state, action: PayloadAction<Item>) {
      const updatedItem = action.payload;

      let oldDay: string | undefined;
      let targetItem: Item | undefined;

      // If it’s a recurring child, find the parent (optional logic — feel free to expand)
      if (updatedItem.recurParentId > 0) {
        for (const [day, items] of Object.entries(state.items)) {
          targetItem = items.find(item => item.id === updatedItem.recurParentId);
          if (targetItem) break;
        }
      }

      // Find old day where the item exists
      for (const [day, items] of Object.entries(state.items)) {
        if (items.some(item => item.id === updatedItem.id)) {
          oldDay = day;
          break;
        }
      }
      if (!oldDay) {
        console.warn('Item not found in any day.');
        return;
      }

      // Remove from old day
      const filteredItems = state.items[oldDay].filter(item => item.id !== updatedItem.id);
      if (filteredItems.length > 0) {
        state.items[oldDay] = filteredItems;
      } else {
        delete state.items[oldDay];
      }

      // Add to new day
      const targetItems = state.items[updatedItem.day] || [];
      const index = targetItems.findIndex(item => item.id === updatedItem.id);

      if (index >= 0) {
        console.log('a');
        targetItems[index] = updatedItem;
      } else {
        console.log('c');
        targetItems.push(updatedItem);
      }
      console.log(targetItems);
      state.items[updatedItem.day] = targetItems;
      saveAgendaData(state.items);
    },
  },
});

export const { setAllItems, addItem, deleteItem, updateItem } = itemsSlice.actions;
export default itemsSlice.reducer;