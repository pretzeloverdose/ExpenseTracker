import { EventsData, Item } from "./Item";

export type RootStackParamList = {
  Home: { eventsData: EventsData; };
  Search: { eventsData: EventsData; onItemSelect?: (id: number) => void; };
  Edit: { eventsData: EventsData; selectedItem: Item; };
  Add: { eventsData: EventsData; };
  CustomiseTheme: undefined;
  MonthlySummary: { eventsData: EventsData; };
  Categories: { eventsData: EventsData; };
  Terms: undefined;
  SecureAccess: undefined; // Screen for secure access, e.g., PIN or biometric authentication
  
  // Add other screens here as needed
};

// This helps with TypeScript inference for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}