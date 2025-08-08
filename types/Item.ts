export interface Item {
    id: number;
    name: string;
    height: number;
    day: string;
    time: string;
    color: string;
    amount: string;
    recurring: boolean;
    recurInterval: number;
    recurSetDays: boolean;
    recurParentId: number;
    notificationEnabled: boolean;
    notificationTimeOffset?: string;
  }
  
export interface Category {
    id: number;
    name: string;
}

export interface CategoryRelationship {
    id: number;
    itemId: number;
    categoryId: number;
}
export type ItemWithCategory = Item & {
    categories: Category[];
    itemId: number;
} 

  export type EventsData = {
    [date: string]: Item[];
  }