import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Alert, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const CATEGORIES_KEY = 'categoriesData';

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'>;

const CategoriesScreen: React.FC<Props > = ({ route }) => {
  const { primaryColor } = useTheme();
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editCategory, setEditCategory] = useState<{ id: number; name: string } | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const eventsData = route?.params?.eventsData ?? {};

  // Load categories from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(CATEGORIES_KEY);
        if (stored) setCategories(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load categories:', e);
      }
    })();
  }, []);

  // Save categories to storage
  const saveCategories = async (newCategories: { id: number; name: string }[]) => {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  };

  // Add a new category
  const addCategory = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    if (categories.some(cat => cat.name.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert('Category already exists');
      return;
    }
    const newCategory = { id: Date.now(), name: trimmed };
    const updated = [...categories, newCategory];
    setCategories(updated);
    saveCategories(updated);
    setCategoryName('');
  };

  // Edit category
  const openEditModal = (category: { id: number; name: string }) => {
    setEditCategory(category);
    setEditCategoryName(category.name);
    setEditModalVisible(true);
  };

  const saveEditCategory = () => {
    if (!editCategory) return;
    const trimmed = editCategoryName.trim();
    if (!trimmed) return;
    if (categories.some(cat => cat.name.toLowerCase() === trimmed.toLowerCase() && cat.id !== editCategory.id)) {
      Alert.alert('Category already exists');
      return;
    }
    const updated = categories.map(cat =>
      cat.id === editCategory.id ? { ...cat, name: trimmed } : cat
    );
    setCategories(updated);
    saveCategories(updated);
    setEditModalVisible(false);
    setEditCategory(null);
    setEditCategoryName('');
  };

  // Delete category
  const deleteCategory = (id: number) => {
    Alert.alert('Delete Category', 'Are you sure you want to delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = categories.filter(cat => cat.id !== id);
          setCategories(updated);
          saveCategories(updated);
        },
      },
    ]);
  };

  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: primaryColor }}>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            paddingHorizontal: 10,
            marginRight: 10,
            backgroundColor: '#fff',
            borderRadius: 5,
          }}
          placeholder="Enter category name"
          value={categoryName}
          onChangeText={setCategoryName}
        />
        <TouchableOpacity
          onPress={addCategory}
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 16,
            justifyContent: 'center',
            borderRadius: 5,
          }}
        >
          <Text style={{ color: '#666', fontWeight: 'bold' }}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#fff', borderRadius: 5, marginBottom: 5 }}>
            <Text style={{ flex: 1 }}>{item.name}</Text>
            <TouchableOpacity onPress={() => openEditModal(item)} style={{ marginRight: 10 }}>
              <Text style={{ color: '#1a4060', fontWeight: 'bold' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCategory(item.id)}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            width: '80%'
          }}>
            <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Edit Category</Text>
            <TextInput
              value={editCategoryName}
              onChangeText={setEditCategoryName}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                padding: 8,
                marginBottom: 15,
                backgroundColor: '#f9f9f9'
              }}
              placeholder="Category name"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginRight: 15 }}>
                <Text style={{ color: '#666' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEditCategory}>
                <Text style={{ color: '#1a4060', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoriesScreen;