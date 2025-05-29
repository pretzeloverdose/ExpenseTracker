// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from './types/Item';

const STORAGE_KEY = 'agendaData';
const COLOR_KEY = 'themeColor';
const CATEGORIES_KEY = 'categoriesData';

const loadFromStorage = async (): Promise<Record<string, Item[]>> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Failed to load agenda data:', e);
    return {};
  }
};

export const saveThemeColor = async (color: string) => {
  try {
    await AsyncStorage.setItem(COLOR_KEY, color);
  } catch (e) {
    console.error('Failed to save theme color:', e);
  }
};

export const loadThemeColor = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(COLOR_KEY);
  } catch (e) {
    console.error('Failed to load theme color:', e);
    return null;
  }
};

export default loadFromStorage;