import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { format, addMonths, lastDayOfMonth } from 'date-fns';
import globalStyles, { createGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'MonthlySummary'>;

const screenWidth = Dimensions.get('window').width;

function getMonthlyIncomeExpenses(
  data: Record<string, any[]>,
  month: string
) {
  let income = 0;
  let expenses = 0;
  let runningBalance = 0;
  let dailyIncome: number[] = [];
  let dailyExpenses: number[] = [];
  let dailyRunningBalance: number[] = [];
  let days: string[] = [];

  // 1. Sort all dates with data
  const allDates = Object.keys(data).sort();

  // 2. Track last running balance for each month
  const monthBalances: Record<string, number> = {};
  let currentMonth = '';
  let lastBalance = 0;

  // 3. Calculate running balance for all dates, store last balance for each month
  allDates.forEach(dateStr => {
    const dateMonth = dateStr.slice(0, 7);
    if (currentMonth !== dateMonth) {
      if (currentMonth) {
        monthBalances[currentMonth] = lastBalance;
      }
      currentMonth = dateMonth;
    }
    (data[dateStr] || []).forEach(item => {
      if (item.color === 'red') {
        lastBalance -= item.amount;
      } else {
        lastBalance += item.amount;
      }
    });
  });
  // Store last month seen
  if (currentMonth) {
    monthBalances[currentMonth] = lastBalance;
  }

  // 4. Use previous month's last balance as starting running balance
  const prevMonth = format(addMonths(new Date(month + '-01'), -1), 'yyyy-MM');
  const prevMonthLastBalance = monthBalances[prevMonth] ?? 0;
  runningBalance = prevMonthLastBalance;

  // 5. Get all days in the current month
  const allDays = Object.keys(data)
    .filter(day => day.startsWith(month))
    .sort();

  allDays.forEach(day => {
    let dayIncome = 0;
    let dayExpense = 0;
    let dayRunnningBalance = runningBalance;
    (data[day] || []).forEach(item => {
      if (item.color === 'red') {
        dayExpense += parseFloat(item.amount);
        expenses += parseFloat(item.amount);
        runningBalance -= parseFloat(item.amount);
        dayRunnningBalance = runningBalance;
      } else {
        dayIncome += parseFloat(item.amount);
        income += parseFloat(item.amount);
        runningBalance += parseFloat(item.amount);
        dayRunnningBalance = runningBalance;
      }
    });
    dailyIncome.push(dayIncome);
    dailyExpenses.push(dayExpense);
    dailyRunningBalance.push(dayRunnningBalance);
    days.push(day.slice(-2)); // just the day number
  });

  // Ensure first and last calendar day entries
  const firstCalendarDay = format(new Date(month + '-01'), 'dd');
  const lastCalendarDay = format(lastDayOfMonth(new Date(month + '-01')), 'dd');

  if (!days.includes(firstCalendarDay)) {
    days.unshift(firstCalendarDay);
    dailyIncome.unshift(0);
    dailyExpenses.unshift(0);
    dailyRunningBalance.unshift(prevMonthLastBalance);
  }
  if (!days.includes(lastCalendarDay)) {
    days.push(lastCalendarDay);
    dailyIncome.push(0);
    dailyExpenses.push(0);
    dailyRunningBalance.push(runningBalance);
  }

  return { income, expenses, dailyIncome, dailyExpenses, dailyRunningBalance, days };
}

const SummaryScreen: React.FC<Props > = ({ route }) => {
  const eventsData = route?.params?.eventsData ?? {};

  // Start with the current month
  const [monthDate, setMonthDate] = useState(new Date());
  const monthStr = format(monthDate, 'yyyy-MM');
  const { income, expenses, dailyIncome, dailyExpenses, dailyRunningBalance, days } = getMonthlyIncomeExpenses(eventsData, monthStr);
  const { primaryColor } = useTheme();
  const globalStyles = createGlobalStyles(primaryColor);  

  return (
    <ScrollView style={[globalStyles.container, { padding: 20, backgroundColor: primaryColor }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8, borderRadius: 8, backgroundColor: '#fff', padding: 10 }}>
        <TouchableOpacity onPress={() => setMonthDate(addMonths(monthDate, -1))} style={[styles.navBtn, { backgroundColor: primaryColor }]}>
          <Icon name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 20 }}>
          {format(monthDate, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={() => setMonthDate(addMonths(monthDate, 1))} style={[styles.navBtn, { backgroundColor: primaryColor }]}>
          <Icon name="chevron-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={{marginVertical: 8, borderRadius: 8, backgroundColor: '#fff', padding: 0 }}>
      <PieChart
        data={[
          { name: 'Income', amount: Math.round(income * 100) / 100, color: '#4caf50' },
          { name: 'Expenses', amount: Math.round(expenses * 100) / 100, color: '#f44336' },
        ]}
        width={screenWidth - 40}
        height={160}
        chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(26, 64, 96, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            style: { borderRadius: 8 },
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
      />
      </View>
      <LineChart
        data={{
          labels: days.length > 0 ? days : [''],
          datasets: [
            { data: dailyIncome.length > 0 ? dailyIncome : [0], color: () => '#4caf50', strokeWidth: 2 },
            { data: dailyExpenses.length > 0 ? dailyExpenses : [0], color: () => '#f44336', strokeWidth: 2 },
            { data: dailyRunningBalance.length > 0 ? dailyRunningBalance : [0], color: () => '#2196f3', strokeWidth: 2 },
          ],
          legend: ['Income', 'Expenses', 'Balance'],
        }}
        width={screenWidth - 40}
        height={180}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(26, 64, 96, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          style: { borderRadius: 8 },
          propsForDots: { r: '3', strokeWidth: '2', stroke: '#fff' },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 8 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  navBtn: {
    padding: 8,
    borderRadius: 5,
  },
  navBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SummaryScreen;