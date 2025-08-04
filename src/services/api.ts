import axios from 'axios';
import { ReceiptData, UploadResponse, DashboardStats } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadReceipt = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('receipt', file);

  try {
    const response = await api.post('/receipts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading receipt:', error);
    return {
      success: false,
      error: 'Failed to upload receipt. Please try again.',
    };
  }
};

export const getReceipts = async (): Promise<ReceiptData[]> => {
  try {
    const response = await api.get('/receipts');
    return response.data;
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return [];
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get('/receipts/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalSpent: 0,
      totalReceipts: 0,
      monthlySpending: [],
      categoryBreakdown: [],
    };
  }
};

export const deleteReceipt = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/receipts/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting receipt:', error);
    return false;
  }
}; 