export interface Product {
  id: string;
  category: string;
  name: string;
  caseSize: number;
}

export interface Location {
  id: string;
  name: string;
  type: 'Storage' | 'Satellite' | 'Bar';
}

export interface Staff {
  id: string;
  name: string;
  role?: 'Admin' | 'Staff' | 'Logistics'; // New Field
  assignedLocation?: string; // New Field
}

export interface AppConfig {
  products: Product[];
  locations: Location[];
  staff: Staff[];
}

export interface StockItemSubmission {
  productName: string;
  quantity: number; // Total units (bottles/cans)
}

export interface StocktakePayload {
  type: 'stocktake';
  timestamp: string;
  staffName: string;
  barName: string;
  session: 'Opening' | 'Closing';
  items: StockItemSubmission[];
}

export interface TransferPayload {
  type: 'transfer';
  timestamp: string;
  staffName: string;
  source: string;
  destination: string;
  items: StockItemSubmission[];
}

export type ViewState = 'AUTH' | 'DASHBOARD' | 'STOCKTAKE' | 'TRANSFER';