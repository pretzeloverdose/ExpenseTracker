export interface Item {
    id: number;
    name: string;
    height: number;
    day: string;
    time: string;
    color: string;
    amount: number;
    recurring: boolean;
    recurInterval: number;
    recurSetDays: boolean;
    recurParentId: number;
    notificationEnabled: boolean;
    notificationTime?: string;
  }
  
  export type EventsData = {
    [date: string]: Item[];
  }