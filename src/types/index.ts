export interface ReceiptItem {
  name: string;
  price: number;
}

export interface ParsedReceipt {
  merchant: string;
  date: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  category: string;
  paymentMethod?: string;
}

export interface ReceiptData {
  id: string;
  imageUrl: string;
  parsedData: ParsedReceipt;
  rawText: string;
  uploadedAt: string;
  userId?: string;
}

export interface UploadResponse {
  success: boolean;
  data?: ReceiptData;
  error?: string;
}

export interface DashboardStats {
  totalSpent: number;
  totalReceipts: number;
  monthlySpending: { month: string; amount: number }[];
  categoryBreakdown: { category: string; amount: number }[];
}

export type Category = 
  | 'Food'
  | 'Travel'
  | 'Grocery'
  | 'Entertainment'
  | 'Transportation'
  | 'Shopping'
  | 'Healthcare'
  | 'Utilities'
  | 'Other';

export interface FilterOptions {
  category?: Category;
  dateRange?: {
    start: string;
    end: string;
  };
  minAmount?: number;
  maxAmount?: number;
} 