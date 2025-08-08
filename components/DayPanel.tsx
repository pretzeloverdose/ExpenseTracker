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
import globalStyles, { createGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';

const DayPanel: React.FC<DayPanelProps> = ({ weekData, selectedDateIn, dataIn, onDayPress }) => {
    const [selectedDate, setSelectedDate] = useState<DateParsable | undefined>(selectedDateIn);
    const [data, setData] = useState<Record<string, Item[]>>(dataIn);

    const { primaryColor } = useTheme();
    const globalStyles = createGlobalStyles(primaryColor);

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
          let amount = parseFloat(item.amount);
          const signed = item.color === 'red' ? -amount : amount;
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
        <View style={globalStyles.dayPanelContainer}>
        <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true} style={globalStyles.dayPanelContent}>
  {weekData.days.map((day, index) => {
    const today = isToday(day.date);
    let selectedHighlight = false;
    if (isSameDay(day.date, selectedDate || new Date())) {
      selectedHighlight = true;
    }
    const thisDate = format(day.date, 'yyyy-MM-dd');
    return (
      <TouchableOpacity key={index} onPress={() => onDayPress?.(thisDate)}>  
        <View style={[globalStyles.dayPanelItem, selectedHighlight && globalStyles.highlightedPanel]}>
          <View style={globalStyles.dayText}>
            <Text style={[globalStyles.dayPanelDay, today && globalStyles.blackText]}>{day.dayName}</Text>
            <Text style={[globalStyles.dayPanelDate, today && globalStyles.blackText]}>{day.dayNumber}</Text>
          </View>
          <View style={globalStyles.dayInfo}>
            {
              !!data[thisDate] &&
              data[thisDate]
                ?.slice() // create a shallow copy to avoid mutating original
                .sort((a, b) => {
                  // Assume item.time is in "HH:mm:ss" format
                  const [aH = '00', aM = '00'] = (a.time || '').split(':');
                  const [bH = '00', bM = '00'] = (b.time || '').split(':');
                  const aHour = parseInt(aH, 10);
                  const aMin = parseInt(aM, 10);
                  const bHour = parseInt(bH, 10);
                  const bMin = parseInt(bM, 10);
                  if (aHour !== bHour) return aHour - bHour;
                  return aMin - bMin;
                })
                .map((item, itemIndex) => {
                return (
                  <View key={`${thisDate}-${itemIndex}`} style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={item.color === 'red' ? { color: 'red', fontSize: 12, width: 50, textAlign: 'right' } : { color: 'green', fontSize: 12, width: 50, textAlign: 'right' }}>
                      {item.amount}
                    </Text>
                    <Text style={{color: '#666', fontSize: 12, width: 10}}> - </Text>
                    <Text style={{color: '#666', fontSize: 12, width: 180}}>{item.time ?? '00:00'} {item.name}{item.recurring && `\n`+'(recurring)'}</Text>
                  </View>
                );
              })
            }
            {(() => {
              if (!!data[thisDate]) {
                return <View style={{ marginRight: 35, borderTopColor: '#f3f3f3', borderTopWidth: 1, marginTop: 12, marginBottom: 5 }}></View>
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

export default DayPanel;