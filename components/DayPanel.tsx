import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  format, 
  startOfWeek, 
  addWeeks, 
  eachDayOfInterval, 
  addDays,
  isSameWeek,
  isSameDay,
  differenceInWeeks,
  isToday,
  isEqual,
  startOfDay
} from 'date-fns';
import { DayData, DayPanelProps, WeekData } from '../types/dates'
import { DateParsable } from 'react-native-calendar-picker';
import { Item } from '../types/Item';

const DayPanel: React.FC<DayPanelProps> = ({ weekData, selectedDateIn, dataIn, onDayPress }) => {
    const [selectedDate, setSelectedDate] = useState<DateParsable | undefined>(selectedDateIn);
    const [data, setData] = useState<Record<string, Item[]>>(dataIn);
    useEffect(() => {
    // Your logic to handle the date change
    if (selectedDateIn) {
      setSelectedDate(selectedDateIn);
    }
  }, [selectedDateIn]);

  useEffect(() => {
    setData(dataIn);
  }, [dataIn]);

  const computeDailyRunningBalance = (data: Record<string, Item[]>) => {
      // Get the range of all days
      const sortedDays = Object.keys(data).sort();
      const startDate = new Date(sortedDays[0]);
      const endDate = new Date(sortedDays[sortedDays.length - 1]);
      const allDays = eachDayOfInterval({ start: startOfDay(startDate), end: startOfDay(endDate) }).map((date) =>
        format(date, 'yyyy-MM-dd') // Format the date to "YYYY-MM-DD" without the time portion
      );

      let cumulativeBalance = 0;

      // Iterate through all days, including those with no items
      return allDays.map((day, index) => {
        const items = data[day] || []; // Use an empty array if no data exists for the day
        const dayTotal = items.reduce((sum, item) => {
          const signed = item.color === 'red' ? -item.amount : item.amount;
          return sum + signed;
        }, 0);

        cumulativeBalance += dayTotal;

        return {
          day,
          dayTotal,
          runningBalance: cumulativeBalance,
        };
      });
    };

    const runningBalances = computeDailyRunningBalance(data);

    return (
        <View style={styles.dayPanelContainer}>
        <ScrollView style={styles.dayPanelContent}>
  {weekData.days.map((day, index) => {
    const today = isToday(day.date);
    let selectedHighlight = false;
    if (isSameDay(day.date, selectedDate || new Date())) {
      selectedHighlight = true;
    }
    const thisDate = format(day.date, 'yyyy-MM-dd');
    return (
      <TouchableOpacity key={index} onPress={() => onDayPress?.(thisDate)}>  
        <View style={[styles.dayPanelItem, selectedHighlight && styles.highlightedPanel]}>
          <View style={styles.dayText}>
            <Text style={[styles.dayPanelDay, today && styles.blackText]}>{day.dayName}</Text>
            <Text style={[styles.dayPanelDate, today && styles.blackText]}>{day.dayNumber}</Text>
          </View>
          <View style={styles.dayInfo}>
            {
              !!data[thisDate] &&
              data[thisDate].map((item, itemIndex) => {
                return (
                  <View key={`${thisDate}-${itemIndex}`} style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={item.color === 'red' ? { color: 'red', fontSize: 12, width: 50, textAlign: 'right' } : { color: 'green', fontSize: 12, width: 50, textAlign: 'right' }}>
                      {item.amount.toFixed(2)}
                    </Text>
                    <Text style={{color: '#666', fontSize: 12, width: 10}}> - </Text>
                    <Text style={{color: '#666', fontSize: 12, width: 190}}>{item.name}</Text>
                  </View>
                );
              })
            }
            {(() => {
              if (!!data[thisDate]) {
                return <View style={{ marginRight: 15, borderTopColor: '#f3f3f3', borderTopWidth: 1, marginTop: 12, marginBottom: 5 }}></View>
              }
              return null;
            })()}
            {(() => {
              if (!!data[thisDate]) {
                const total = runningBalances.find((entry) => entry.day === thisDate)?.dayTotal || 0;
                return <View key={`${thisDate}-total`} style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={total <= 0 ? { color: 'red', fontSize: 12, width: 50, textAlign: 'right' } : { color: 'green', fontSize: 12, width: 50, textAlign: 'right' }}>
                    {total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </Text>
                  <Text style={{color: '#666', fontSize: 12, width: 10}}> - </Text>
                  <Text style={{color: '#666', fontSize: 12, width: 190}}>Day Total</Text>
                </View>;
              }
              return null;
            })()}
            {(() => {
              const index = runningBalances.findIndex(entry => entry.day === thisDate);
              const isLast = (index === runningBalances.length - 1 && runningBalances.length != 0);
              const hasFutureEntries = index !== -1 && index < runningBalances.length - 1;

              if ((isLast && data !== null) || hasFutureEntries) {
                const balance = runningBalances[index]?.runningBalance || 0;
                return <View key={`${thisDate}-balance`} style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={balance <= 0 ? { color: 'red', fontSize: 12, width: 50, textAlign: 'right' } : { color: 'green', fontSize: 12, width: 50, textAlign: 'right' }}>
                    {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={{color: '#666', fontSize: 12, width: 10}}> - </Text>
                  <Text style={{color: '#666', fontSize: 12, width: 190}}>Running Balance</Text>
                </View>;
              }
              return null;
            })()}
          </View>
        </View>
      </TouchableOpacity>
    )})}
</ScrollView>
      </View>
    );
  };
  const styles = StyleSheet.create({
    dayPanelContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 16,
      },
      weekTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
      },
      dayPanelContent: {
        flexDirection: 'column',
        flex: 1
      },
      dayPanelItem: {
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 4,
        flexDirection: 'row'
      },
      highlightedPanel: {
        borderColor: '#1a4060',
        borderWidth: 1
      },
      dayPanelDay: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        padding: 8,
        alignSelf: 'center',
        paddingBottom: 0
      },
      dayPanelDate: {
        fontSize: 12,
        padding: 8,
        paddingTop: 0,
        paddingBottom: 12,
        color: '#666',
      },
      dayText: {
        flexDirection: 'column',
      },
      dayInfo: {
        padding: 8,
        marginRight: 35,
        borderLeftWidth: 1,
        borderColor: '#f5f5f5',
        fontSize: 12
      },
      dayInfoStyle: {
        fontSize: 12,
        color: '#666'
      },
      blackText: {
        color: '#000',
        fontWeight: 'bold'
      }
  });

export default DayPanel;