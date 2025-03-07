// Store type
export interface Store {
    id: string;
    name: string;
    city: string;
    state: string;
  }
  
  // SKU type
  export interface SKU {
    id: string;
    name: string;
    price: number;
    cost: number;
  }
  
  // Planning data type
  export interface PlanningRow {
    storeId: number;
    skuId: string;
    week: string;
    salesUnits: number | null;
    salesDollars: number | null;
    gmDollars: number | null;
    gmPercent: number | null;
  }

  // Chart data
  export interface ChartData {
    week: string;
    gmDollars: number;
    gmPercent: number;
  }
  
  // Redux state shape
  export interface AppState {
    stores: Store[];
    skus: SKU[];
    planning: PlanningRow[];
  }