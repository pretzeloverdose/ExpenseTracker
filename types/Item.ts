export interface Item {
    id: number;
    name: string;
    height: number;
    day: string;
    color: string;
    amount: number;
    recurring: boolean;
    recurInterval: number;
    recurSetDays: boolean;
    recurParentId: number;
  }
  
  export type EventsData = {
    [date: string]: Item[];
  }