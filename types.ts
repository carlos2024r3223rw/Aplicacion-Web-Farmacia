
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  price: number;
  expiryDate: string;
}

export interface SummaryData {
  pendingPrescriptions: number;
  lowStockAlerts: number;
  todaySales: number;
}

export type TabType = 'Dashboard' | 'Inventory' | 'Orders' | 'Settings';
