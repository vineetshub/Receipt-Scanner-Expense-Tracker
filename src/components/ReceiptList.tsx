import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Filter, Trash2, Eye, Calendar, DollarSign } from 'lucide-react';
import { ReceiptData, Category } from '../types';
import { deleteReceipt } from '../services/api';

interface ReceiptListProps {
  receipts: ReceiptData[];
  onReceiptDeleted: () => void;
}

const ReceiptList: React.FC<ReceiptListProps> = ({ receipts, onReceiptDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'merchant'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories: Category[] = [
    'Food', 'Travel', 'Grocery', 'Entertainment', 
    'Transportation', 'Shopping', 'Healthcare', 'Utilities', 'Other'
  ];

  const filteredAndSortedReceipts = useMemo(() => {
    let filtered = receipts.filter(receipt => {
      const matchesSearch = receipt.parsedData.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           receipt.parsedData.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || receipt.parsedData.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.parsedData.date);
          bValue = new Date(b.parsedData.date);
          break;
        case 'amount':
          aValue = a.parsedData.total;
          bValue = b.parsedData.total;
          break;
        case 'merchant':
          aValue = a.parsedData.merchant.toLowerCase();
          bValue = b.parsedData.merchant.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [receipts, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      const success = await deleteReceipt(id);
      if (success) {
        onReceiptDeleted();
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category | '')}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'merchant')}
              className="input-field"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="merchant">Sort by Merchant</option>
            </select>
            
            <button
              onClick={toggleSortOrder}
              className="btn-secondary flex items-center space-x-1"
            >
              <Filter className="h-4 w-4" />
              <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            All Receipts ({filteredAndSortedReceipts.length})
          </h2>
        </div>

        {filteredAndSortedReceipts.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {receipts.length === 0 ? 'No receipts uploaded yet' : 'No receipts match your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedReceipts.map((receipt) => (
              <div key={receipt.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-primary-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{receipt.parsedData.merchant}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(receipt.parsedData.date), 'MMM dd, yyyy')}</span>
                        </div>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                          {receipt.parsedData.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${receipt.parsedData.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {receipt.parsedData.items.length} items
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(receipt.imageUrl, '_blank')}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View receipt"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(receipt.id)}
                        className="p-2 text-gray-600 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Delete receipt"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Items breakdown */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
                      <div className="space-y-1">
                        {receipt.parsedData.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.name}</span>
                            <span className="text-gray-900">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                        {receipt.parsedData.items.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{receipt.parsedData.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="text-gray-900">${receipt.parsedData.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="text-gray-900">${receipt.parsedData.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-700">Total:</span>
                          <span className="text-gray-900">${receipt.parsedData.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptList; 