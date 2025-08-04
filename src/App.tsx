import React, { useState, useEffect } from 'react';
import { ReceiptData, DashboardStats } from './types';
import { getReceipts, getDashboardStats } from './services/api';
import Header from './components/Header';
import ReceiptUpload from './components/ReceiptUpload';
import Dashboard from './components/Dashboard';
import ReceiptList from './components/ReceiptList';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'receipts'>('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [receiptsData, statsData] = await Promise.all([
        getReceipts(),
        getDashboardStats(),
      ]);
      setReceipts(receiptsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptUploaded = (newReceipt: ReceiptData) => {
    setReceipts(prev => [newReceipt, ...prev]);
    loadData(); // Refresh stats
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ReceiptUpload onReceiptUploaded={handleReceiptUploaded} />
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'receipts'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Receipts ({receipts.length})
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <Dashboard stats={stats} receipts={receipts} />
        ) : (
          <ReceiptList 
            receipts={receipts} 
            onReceiptDeleted={() => loadData()}
          />
        )}
      </main>
    </div>
  );
}

export default App; 