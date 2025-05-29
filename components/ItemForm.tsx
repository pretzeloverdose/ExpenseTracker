import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Item } from '../types/Item'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { set } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, CategoryRelationship } from '../types/Item';


interface ItemFormProps {
  editItem?: Item;
  defaultDay: string;
  onSave: (item: Item) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ editItem, defaultDay, onSave, onCancel }) => {
  const [name, setName] = useState(editItem?.name || '');
  const [amount, setAmount] = useState(editItem?.amount?.toString() || '');
  const [color, setColor] = useState(editItem?.color || 'green');
  const [date, setDate] = useState(new Date(editItem?.day || defaultDay));
  const [timeHour, setTimeHour] = useState(parseInt(editItem?.time?.split(':')[0] || '00'));
  const [timeMinute, setTimeMinute] = useState(parseInt(editItem?.time?.split(':')[1] || '00'));
  const [recurring, setRecurring] = useState(editItem?.recurring || false);
  const [recurInterval, setRecurInterval] = useState(editItem?.recurInterval?.toString() || '');
  const [recurSetDays, setRecurSetDays] = useState(editItem?.recurSetDays || false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notifificationEnabled, setNotificationEnabled] = useState(editItem?.notificationEnabled || false);
  const [notificationTime, setNotificationTime] = useState(editItem?.notificationTime || '');
  const [notificationHour, setNotificationHour] = useState(0);
  const [notificationMinute, setNotificationMinute] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Load categories and relationships on mount or when editing
  useEffect(() => {
    (async () => {
      // Load categories
      const stored = await AsyncStorage.getItem('categoriesData');
      if (stored) setCategories(JSON.parse(stored));

      // If editing, load relationships and set selected categories
      if (editItem) {
        const relsRaw = await AsyncStorage.getItem('categoryRelationships');
        if (relsRaw) {
          const relationships: CategoryRelationship[] = JSON.parse(relsRaw);
          const related = relationships.filter(rel => rel.itemId === editItem.id);
          setSelectedCategoryIds(related.map(rel => rel.categoryId));
        }
      }
    })();
  }, [editItem]);

  const handleSubmit = async () => {
    if (!name || !amount) return;

    const item: Item = {
      id: editItem?.id ?? Date.now(),
      name,
      height: 80,
      day: format(date, 'yyyy-MM-dd'),
      time: timeHour.toString().padStart(2, '0') + ':' + timeMinute.toString().padStart(2, '0'),
      color,
      amount: parseFloat(amount),
      recurring,
      recurInterval: parseInt(recurInterval),
      recurSetDays,
      recurParentId: 0,
      notificationEnabled: false,
      notificationTime: undefined,
    };

    onSave(item);
    await saveCategoryRelationships(item.id, selectedCategoryIds);
  };

  const saveCategoryRelationships = async (itemId: number, categoryIds: number[]) => {
    try {
      const stored = await AsyncStorage.getItem('categoryRelationships');
      let relationships: CategoryRelationship[] = stored ? JSON.parse(stored) : [];
      // Remove old relationships for this item
      relationships = relationships.filter(rel => rel.itemId !== itemId);
      // Add new relationships
      const newRels = categoryIds.map(catId => ({
        id: Date.now() + Math.random(), // unique id
        itemId,
        categoryId: catId,
      }));
      relationships = [...relationships, ...newRels];
      await AsyncStorage.setItem('categoryRelationships', JSON.stringify(relationships));
    } catch (e) {
      console.error('Failed to save category relationships:', e);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1 }}>
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
      <View>
        <Text>Description:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter the description"
          maxLength={60}
          style={{ borderBottomWidth: 1, marginBottom: 12 }}
        />

        <View style={{ flexDirection: 'row', marginBottom: 17, alignItems: 'center' }}>
        <Text>Amount: </Text>
        <TextInput
          value={amount}
          onChangeText={(text) => {
            // Allow only numbers and max two decimals
            if (/^\d*\.?\d{0,2}$/.test(text)) {
              setAmount(text);
            }
          }}
          keyboardType="numeric"
          placeholder="Enter the amount"
          style={{ borderBottomWidth: 1, alignSelf: 'flex-start' }}
        />
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'baseline' }}>
        <Text>Type:   </Text>
        <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setColor('green')}>
            <Text style={{ color: color === 'green' ? 'green' : 'grey', marginRight: 20 }}>
              ● Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setColor('red')}>
            <Text style={{ color: color === 'red' ? 'red' : 'grey' }}>● Expense</Text>
          </TouchableOpacity>
        </View>
        </View>
        
        <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'baseline' }}>
        <Text>Recurring:   </Text>
        <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setRecurring(false)}>
            <Text style={{ color: recurring ? 'grey' : 'green', marginRight: 20 }}>● No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRecurring(true)}>
            <Text style={{color: recurring == false ? 'grey' : 'green'}}>● Yes</Text>
          </TouchableOpacity>
        </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'center' }}>
          <Text style={{alignItems: 'baseline', flexDirection: 'row'}}>{recurring ? 'Starting ' : ''}Day:  </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View style={{alignItems: 'baseline', flexDirection: 'row'}}>
            <Icon name="calendar-today" size={24} color="black" style={{ alignSelf: 'flex-start', alignContent: 'center' }} />
            <Text style={{ alignContent: 'flex-end', paddingTop: 3 }}>  {format(date, 'yyyy-MM-dd')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center' }}>
      <Text>Time: </Text>
            {/* Hour Picker */}
            <Picker
              selectedValue={parseInt(timeHour.toString() || '00')}
              style={{ height: 50, width: 90 }}
              onValueChange={(hour) => {
                setTimeHour(hour);
              }}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <Picker.Item key={hour} label={`${hour}`} value={hour} style={{fontSize: 14}} />
              ))}
            </Picker>
              <Text>:</Text>
            {/* Minute Picker */}
            <Picker
              selectedValue={parseInt(timeMinute.toString() || '00')}
              style={{ height: 50, width: 100 }}
              onValueChange={(minute) => {
                setTimeMinute(minute);
              }}
            >
              {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                <Picker.Item key={minute} label={`${minute}`} value={minute} style={{fontSize: 14}} />
              ))}
            </Picker>
      </View>
      {recurring && (
        <View>
          <Text>Recurring every  {`\n`}</Text>
          <View style={{ flexDirection: 'row', marginBottom: 32, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <TouchableOpacity onPress={() => { setRecurInterval('7'); setRecurSetDays(false) }}>
            <Text style={{ color: recurInterval === '7' ? 'green' : 'grey', marginRight: 5 }}>
              ● Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setRecurInterval('14'); setRecurSetDays(false) }}>
            <Text style={{ color: recurInterval === '14' ? 'green' : 'grey', marginRight: 5 }}>● 2 Weeks</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setRecurInterval('28'); setRecurSetDays(false) }}>
            <Text style={{ color: recurInterval === '28' ? 'green' : 'grey', marginRight: 5 }}>● 4 Weeks</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setRecurInterval('-1'); setRecurSetDays(false) }}>
            <Text style={{ color: recurInterval === '-1' ? 'green' : 'grey', marginRight: 5 }}>● Month</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setRecurSetDays(true); setRecurInterval('1')}}>
            <Text style={{ color: recurSetDays ? 'green' : 'grey', marginRight: 5 }}>● Specific number of days</Text>
            </TouchableOpacity>
            {recurSetDays && (
              <View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextInput
              value={recurInterval}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
                  setRecurInterval(text); // Convert back to number
                }
              }}
              keyboardType="numeric"
              style={{ alignSelf: 'flex-start' }}
            /><Text>day/s</Text></View>
            )}

          
        </View>
      </View>
      )}
      <View>
        <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center' }}>
          <Text style={{ marginRight: 10 }}>Notification:</Text>
          <Switch
            value={notifificationEnabled}
            onValueChange={setNotificationEnabled}
            thumbColor={notifificationEnabled ? 'green' : 'gray'}
            trackColor={{ false: '#ccc', true: '#a5d6a7' }}
          />
        </View>
        {notifificationEnabled && (
          <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center' }}>
            
          </View>
        )}
      </View>
      <View style={{ marginTop: 0 }}>
        <Button title={editItem ? 'Update' : 'Add'} onPress={handleSubmit} />
        <View style={{ height: 10 }} />
        <Button title="Cancel" onPress={onCancel} color="gray" />
      </View>

      {/* Multi-select UI for Categories */}
      <View style={{ marginVertical: 10 }}>
        <Text style={{ marginBottom: 5 }}>Categories:</Text>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}
            onPress={() => {
              setSelectedCategoryIds(prev =>
                prev.includes(cat.id)
                  ? prev.filter(id => id !== cat.id)
                  : [...prev, cat.id]
              );
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: '#1a4060',
                backgroundColor: selectedCategoryIds.includes(cat.id) ? '#1a4060' : '#fff',
                marginRight: 8,
              }}
            />
            <Text>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    </GestureHandlerRootView>
  );
};

export default ItemForm;
