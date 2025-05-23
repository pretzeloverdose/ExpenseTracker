import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Item } from '../types/Item'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';


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
  const [recurring, setRecurring] = useState(editItem?.recurring || false);
  const [recurInterval, setRecurInterval] = useState(editItem?.recurInterval?.toString() || '');
  const [recurSetDays, setRecurSetDays] = useState(editItem?.recurSetDays || false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!name || !amount) return;

    const item: Item = {
      id: editItem?.id ?? Date.now(),
      name,
      height: 80,
      day: format(date, 'yyyy-MM-dd'),
      color,
      amount: parseFloat(amount),
      recurring,
      recurInterval: parseInt(recurInterval),
      recurSetDays,
      recurParentId: 0
    };

    onSave(item);
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
              ● Gain
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

        <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center' }}>
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
      <View style={{ marginTop: 0 }}>
        <Button title={editItem ? 'Update' : 'Add'} onPress={handleSubmit} />
        <View style={{ height: 10 }} />
        <Button title="Cancel" onPress={onCancel} color="gray" />
      </View>
    </ScrollView>
    </GestureHandlerRootView>
  );
};

export default ItemForm;
