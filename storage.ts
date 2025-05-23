// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from './types/Item';

const STORAGE_KEY = 'agendaData';

const loadFromStorage = async (): Promise<Record<string, Item[]>> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Failed to load agenda data:', e);
    return {};
  }
};
export default loadFromStorage;