import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { format, formatDate, parse } from 'date-fns';
import globalStyles, { createGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';
import { GestureHandlerRootView, Switch } from 'react-native-gesture-handler';

interface NotificationsComponentProps {
  eventsData: EventsData;
}

const NOTIFICATIONS_ENABLED_KEY = 'notificationsEnabled';

const Notifications: React.FC<NotificationsComponentProps> = ({ eventsData }) => {
  const reduxItems = useAppSelector((state) => state.items.items);
  const dispatch = useAppDispatch();
    const [data, setData] = useState<Item[]>([]);
    const { primaryColor } = useTheme();
    const globalStyles = createGlobalStyles(primaryColor);
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
  console.log('Sorted data:', sorted);
}, [reduxItems]);

  const filtered = data.filter(item =>
    item.notificationEnabled == true
  );
  
    function formatDate(dateString: string) {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return format(date, 'do MMMM yyyy');
    }

    return (
        <GestureHandlerRootView style={{flex: 1 }}>
        <View style={globalStyles.container}>
    <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
            // notificationTimeOffset is a string in the form "HH:mm"
            const [offsetHours, offsetMinutes] = (item.notificationTimeOffset ?? "00:00").split(':').map(Number);

            // item.day is "yyyy-MM-dd", item.time is "HH:mm"
            const baseDate = new Date(item.day + 'T' + item.time + ':00');

            // Subtract offset hours and minutes
            const notificationTime = new Date(
                baseDate.getTime() - (offsetHours * 60 + offsetMinutes) * 60000
            );

            const notificationTimeAndDay = notificationTime
                ? format(notificationTime, 'do MMMM yyyy HH:mm')
                : 'No notification set';
          return (
          <View style={globalStyles.item}>
            <View style={globalStyles.row}>
              <View style={globalStyles.leftCol}>
                <TouchableOpacity onPress={() => navigation.navigate('Edit', { selectedItem: item, eventsData })}>
                  <Text style={globalStyles.name}>{formatDate(item.day)} {item.time} - {item.name}</Text>
                  <Text style={globalStyles.name}>Notification at {notificationTimeAndDay}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          )}}
      />
        </View>
        </GestureHandlerRootView>
    );
}


export default Notifications;