import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FlatList, View, Text, Dimensions, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { 
  format, 
  startOfWeek, 
  addWeeks, 
  eachDayOfInterval, 
  addDays,
  isSameWeek,
  differenceInWeeks,
  isToday,
  isWithinInterval,
  endOfWeek,
  parseISO,
  addMonths,
  isBefore
} from 'date-fns';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CalendarPicker, { DateParsable } from 'react-native-calendar-picker';
import { DayData, WeekData } from '../types/dates';
import { EventsData, Item } from '../types/Item';
import DayPanel from './DayPanel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemForm from './ItemForm';
import MenuComponent from './MenuComponent';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import loadFromStorage from '../storage';
import { deleteItem, setAllItems, updateItem } from '../slice';
import { confirmDelete } from '../confirm';

interface Props {
  eventsData: EventsData;
}
const STORAGE_KEY = 'agendaData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const today = new Date();
const START_DATE = new Date(addWeeks(today, -26));
const END_DATE = addWeeks(today, 26);

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

// Load data
export const loadAgendaData = async (): Promise<Record<string, any[]>> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Failed to load agenda data:', e);
    return {};
  }
};

const generateWeeks = (startDate: Date, endDate: Date): WeekData[] => {
    const weeks: WeekData[] = [];
    let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });
  
    while (currentWeekStart <= endDate) {
      const days = eachDayOfInterval({
        start: currentWeekStart,
        end: addDays(currentWeekStart, 6)
      }).map(date => ({
        date,
        dayName: format(date, 'EEE'),
        dayNumber: format(date, 'd/MM')
      }));
  
      weeks.push({
        startDate: currentWeekStart,
        days
      });
  
      currentWeekStart = addWeeks(currentWeekStart, 1);
    }
    return weeks;
  };

  const initialData = {
   '2025-05-14': [
    { id: 1, name: 'Meeting with Alex', height: 80, day: '2025-05-14', color: 'red', amount: 50, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 2, name: 'Lunch with team', height: 80, day: '2025-05-14', color: 'green', amount: 40, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 3, name: 'Meeting with Alex', height: 80, day: '2025-05-14', color: 'red', amount: 50, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 4, name: 'Lunch with team', height: 80, day: '2025-05-14', color: 'green', amount: 10, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 5, name: 'Lunch with team', height: 80, day: '2025-05-14', color: 'green', amount: 50, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 6, name: 'Meeting with Alex', height: 80, day: '2025-05-14', color: 'red', amount: 60, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 7, name: 'Lunch with team', height: 80, day: '2025-05-14', color: 'green', amount: 50, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 8, name: 'Lunch with team', height: 80, day: '2025-05-14', color: 'green', amount: 20, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 9, name: 'Meeting with Alex', height: 80, day: '2025-05-14', color: 'red', amount: 50, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 10, name: 'Lunch with team', height: 80, day: '2025-05-14', color: 'green', amount: 90, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 }
  ],
  '2025-05-07': [
    { id: 11, name: 'Meeting with Alex', height: 80, day: '2025-05-07', color: 'red', amount: 50, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 12, name: 'Lunch with team', height: 80, day: '2025-05-07', color: 'green', amount: 30, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 13, name: 'Meeting with Alex', height: 80, day: '2025-05-07', color: 'red', amount: 30, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 14, name: 'Lunch with team', height: 80, day: '2025-05-07', color: 'green', amount: 40, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 15, name: 'Lunch with team', height: 80, day: '2025-05-07', color: 'green', amount: 10, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 16, name: 'Meeting with Alex', height: 80, day: '2025-05-07', color: 'red', amount: 60, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 17, name: 'Lunch with team', height: 80, day: '2025-05-07', color: 'green', amount: 70, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 18, name: 'Lunch with team', height: 80, day: '2025-05-07', color: 'green', amount: 10, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 19, name: 'Meeting with Alex', height: 80, day: '2025-05-07', color: 'red', amount: 90, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 20, name: 'Lunch with team', height: 80, day: '2025-05-07', color: 'green', amount: 5, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 21, name: 'Lunch with team', height: 80, day: '2025-05-07', color: 'green', amount: 70, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 22, name: 'Lunch with team', height: 80, day: '2025-05-07', color: 'green', amount: 10, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 23, name: 'Meeting with Alex', height: 80, day: '2025-05-07', color: 'red', amount: 90, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 },
    { id: 24, name: 'Lunch with team', height: 80, day: '2025-05-07', color: 'green', amount: 5, recurring: false, recurInterval: 0, recurSetDays: false, recurParentId: 0 }
  ] 
}

export type SlideUpDrawerRef = {
    open: () => void;
    close: () => void;
  };

const highlightItemInCalendar = (id: number) => {
    console.log('Highlighting item:', id);
    
    // Implement your actual highlighting logic here
    // This could scroll to the item or change its style
  };

const WeekCalendar: React.FC<Props> = ({eventsData}) => {
    const reduxItems = useAppSelector((state) => state.items.items);
    const dispatch = useAppDispatch();
    const flatListRef = useRef<FlatList>(null);
    const [weeks, setWeeks] = useState<WeekData[]>([]);
    const [initialIndex, setInitialIndex] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [modalVisible, setModalVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
    const [newItem, setNewItem] = useState(false);
    const [data, setData] = useState<Record<string, Item[]>>({});
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const toggleCalendar = () => {
      setShowCalendar(!showCalendar);
    }
    
    const fetchData = async () => {
      const storedData = await loadFromStorage();
      dispatch(setAllItems(storedData));
      setData(storedData);
    };

    useEffect(() => {
      console.log('here we go');
      fetchData();
    }, [dispatch]);

    useFocusEffect(
      useCallback(() => {
        fetchData();
      }, [dispatch])
    )

    useEffect(() => {
      if (Object.keys(data).length > 0) {
        saveAgendaData(data);
      }
    }, [data]);

    const expandedData = useMemo(() => {
        const result: typeof data = { ...data };
        let nextId = Math.max(
          0,
          ...Object.values(data)
            .flat()
            .map((item) => item.id)
        ) + 1;
        const endDate = addDays(new Date(), 26 * 7); // Agenda shows 26 weeks ahead
      
        Object.values(data).flat().forEach((item) => {
          if (item.recurring) {
            const start = parseISO(item.day);
            let nextDate = item.recurInterval === -1
              ? addMonths(start, 1)
              : addDays(start, item.recurInterval);
          
            while (isBefore(nextDate, endDate)) {
              const key = format(nextDate, 'yyyy-MM-dd');
              const copy = { ...item, id: nextId++, day: key, recurParentId: item.id };
              result[key] = result[key] || [];
              result[key].push(copy);
          
              nextDate = item.recurInterval === -1
                ? addMonths(nextDate, 1)
                : addDays(nextDate, item.recurInterval);
            }
          }
        });
        console.log('mutated: ' + result);
        return result;
      }, [data]);

    const onDateChange = (date: Date) => {
      setSelectedDate(date);
      setShowCalendar(false);
      // You can add additional date handling here
      handleDateSelect(date);
    };

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setShowCalendar(false);
      
      // Find index of the week containing the selected date
      const weekIndex = weeks.findIndex(week => 
        isWithinInterval(date, { 
          start: startOfWeek(week.startDate), 
          end: endOfWeek(week.startDate) 
        })
      );
      
      // Scroll to the selected week
      if (weekIndex !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: weekIndex,
          animated: false,
          viewPosition: 0.5 // Center the selected week
        });
      }
    };

    const customDatesStylesCallback = (date: Date) => {
      let highlight = 0;
      if (Object.keys(expandedData).includes(format(date, "yyyy-MM-dd"))) {
        highlight = 1;
      }
      return {
        style: {
          borderWidth: highlight,
          borderColor: '#1a4060'
        }
      };
    }
  
    useEffect(() => {
      const today = new Date();
      const startDate = START_DATE;
      const endDate = END_DATE;
      
      const generatedWeeks = generateWeeks(startDate, endDate);
      setWeeks(generatedWeeks);
      
      const currentWeekIndex = generatedWeeks.findIndex(week => 
        isSameWeek(week.startDate, today, { weekStartsOn: 0 })
      );
      setInitialIndex(currentWeekIndex);
    }, []);

    const renderItem = ({ item }: { item: WeekData }) => (
      <View style={styles.weekContainer}>
        <View style={styles.dayPanelWrapper}>
        <DayPanel weekData={item} selectedDateIn={selectedDate} dataIn={expandedData} onDayPress={handleDayPress} />
        </View>
      </View>
    );

    const handleDayPress = (day:any) => {
      setSelectedDate(new Date(day));
      setModalVisible(true);
    };

    const selectedDayString = format(selectedDate?.toString(), 'yyyy-MM-dd');
    const itemsForDay = expandedData[selectedDayString] || [];

  const confirmDeleteClick = async(item: Item) => {
    const confirmed = await confirmDelete();
    if (confirmed) {
      dispatch(deleteItem(item));
      fetchData();
    }
  };

  const addItem = (item: Item) => {
    const { day } = item;
    console.log(item);
    if (!day) {
      console.warn('Cannot add item — missing day');
      return;
    }
    setNewItem(false);
    setData((prevData) => {
      const allItems = Object.values(expandedData).flat();
  
      const nextId = Math.max(0, ...allItems.map((i) => i.id)) + 1;
      console.log('nextid ' + nextId);
      const dayItems = prevData[day] || [];
      const newItem = {
        ...item,
        id: nextId,
        day, // make sure the day is included
      };
  
      return {
        ...prevData,
        [day]: [...dayItems, newItem],
      };
    });
    if (editVisible) {
      setEditVisible(false);
    }
  };

  const closeEdit = () => {
    setEditingItem(undefined);
    setEditVisible(false);
  }

  const handleEdit = (item: Item) => {
    // drawerRef.current?.close(); // Close the current modal/drawer
    setModalVisible(false);
    let finalItem: Item | undefined;
    finalItem = item;
    console.log(item.id + ' ' + item.recurParentId);
    if (item.recurParentId > 0) {
      // is a child, edit the parent
      for (const dayItems of Object.values(data)) {
        const parent = dayItems.find(i => i.id === item.recurParentId);
        if (parent) {
          finalItem = parent;
          break;
        }
      }
    }
    setEditingItem(finalItem);
    setEditVisible(true); // Open the edit modal
  };

  const handleUpdate = (updatedItem: Item) => {
    dispatch(updateItem(updatedItem));
    fetchData();
    closeEdit();
  };

  const showMenu = () => {
    setMenuVisible(true);
  }

  const closeMenu = () => {
    setMenuVisible(false);
  }

  return (
    <View style={styles.AppWrap}>
      {menuVisible && (
        <Modal visible={menuVisible} transparent={true} animationType='slide'>
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}>
            <View style={{ flex: 1, backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 15 }}>
              <MenuComponent eventsData={expandedData} onItemHighlight={highlightItemInCalendar}  />
              <TouchableOpacity onPress={closeMenu} style={[styles.closeButton, { marginTop: 10 }]}>
              <Text style={ { color: '#fff' } }><Icon name='close' /> Close</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {!modalVisible && (
        <Modal visible={editVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}>
        <ItemForm 
          editItem={editingItem} 
          defaultDay={selectedDayString} 
          onSave={(item) => { newItem ? addItem(item) : handleUpdate(item); }} 
          onCancel={closeEdit} 
        />
        </View>
        </Modal>
      )}
    <FlatList
      ref={flatListRef}
      data={weeks}
      horizontal
      pagingEnabled
      showsVerticalScrollIndicator={true}
      initialScrollIndex={initialIndex}
      getItemLayout={(_, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index
      })}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.startDate.toISOString()}
      renderItem={renderItem}
    />
      
    <View style={styles.navigation}>
        <TouchableOpacity style={[styles.navigationBtn, styles.iconButton]} onPress={showMenu}>
          <Icon name="menu" size={18} color="#fff" /><Text style={styles.whiteText}> Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCalendar} style={[styles.navigationBtn, styles.iconButton]}>
          <Icon name="calendar-today" size={18} color="#fff" /><Text style={styles.whiteText}> Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navigationBtn, styles.iconButton]} onPress={() => { navigation.navigate('Add',  { eventsData })}}>
          <Icon name="add" size={18} color="#fff" /><Text style={styles.navText}> Add Item</Text>
        </TouchableOpacity>
    </View>
    <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCalendar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <CalendarPicker
              onDateChange={onDateChange}
              minDate={START_DATE}
              maxDate={END_DATE}
              selectedStartDate={selectedDate}
              selectedDayStyle={styles.selectedCalStyle}
              selectedDayTextColor='#fff'
              width={300}
              height={400}
              customDatesStyles={customDatesStylesCallback}
            />
            <TouchableOpacity
              onPress={toggleCalendar}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#ccc', padding: 20, margin: 20, borderRadius: 16 }}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.closeButton, { marginTop: 0}]}>
                <Text style={ { color: '#fff' } }><Icon name='close' /> Close</Text>
            </TouchableOpacity>
            <Text style={{width: 150, marginBottom: 15}}>Details for {selectedDayString}</Text>
            {itemsForDay.length === 0 ? (
              <Text>No entries for {selectedDayString}.</Text>
            ) : (
              <FlatList
                data={itemsForDay}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 }}>
                    <Text>{item.name}</Text>
                    <Text>Amount: ${item.amount} {item.color == 'red' ? `expense` : `income` }{ item.recurring ? ' recurring' : ''}</Text>
                    <Text>
                      <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('Edit', { selectedItem: item, eventsData })}>
                        Edit
                      </Text>{' '}
                      |{' '}
                      <Text style={{ color: 'red' }} onPress={() => confirmDeleteClick(item)}>
                        Delete
                      </Text>
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    AppWrap: {
        height: SCREEN_HEIGHT
    },
    selectedCalStyle: {
      backgroundColor: '#1a4060'
    },
    spaceBEtween: {
      justifyContent: 'space-between'
    },
    navigation: {
        padding: 25,
        paddingBottom: 80,
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navigationBtn: {
        padding: 12,
        backgroundColor: '#1a4060',
        borderRadius: 5,
        marginRight: 6,
        marginLeft: 6,
        margin: 0
    },
    navText: {
        color: '#fff'
    },
    whiteText: {
        color: '#fff'
    },
  weekContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: '#1a4060',
    padding: 16
  },
  daysContainer: {
    margin: 6,
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dayContainer: {
    alignItems: 'center',
    padding: 4
  },
  dayPanelWrapper: {
    flex: 1, // Makes DayPanel fill remaining space
  },
  dayName: {
    fontSize: 12,
    color: '#444',
  },
  dayNumber: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500'
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a4060',
    borderRadius: 8,
    color: '#fff'
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#fff'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    width: '90%',
    maxWidth: 500,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#1a4060',
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 12,
    color: '#fff'
  },
  dateContainer: {
    alignItems: 'center',
},
  dotsContainer: { flexDirection: "row", marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 },
}
);

export default WeekCalendar;