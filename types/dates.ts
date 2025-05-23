import { DateParsable } from "react-native-calendar-picker";
import { Item } from "./Item";

// Single day data
export interface DayData {
  date: Date;
  dayName: string;  // e.g. "Mon"
  dayNumber: string; // e.g. "15/03"
  isToday?: boolean;
  isSelected?: boolean;
}

// Week data structure
export interface WeekData {
  startDate: Date;
  days: DayData[];
}

// Props for DayPanel component
export interface DayPanelProps {
  weekData: WeekData;
  onDayPress?: (day: any) => void;
  selectedDateIn?: DateParsable;
  dataIn: Record<string, Item[]>;
}

// Props for WeekCalendar component
export interface WeekCalendarProps {
  startDate?: Date;
  endDate?: Date;
  onWeekChange?: (week: WeekData) => void;
  initialSelectedDate?: Date;
}