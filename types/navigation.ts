import { EventsData, Item } from "./Item";

export type RootStackParamList = {
  Home: { eventsData: EventsData; };
  Search: { eventsData: EventsData; onItemSelect?: (id: number) => void; };
  Edit: { eventsData: EventsData; selectedItem: Item; };
  Add: { eventsData: EventsData; };
  // Add other screens here as needed
};

// This helps with TypeScript inference for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}