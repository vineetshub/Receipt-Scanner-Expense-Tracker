import React from 'react';
import { Receipt, TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Receipt className="h-8 w-8 text-primary-600" />
              <TrendingUp className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Receipt Scanner
              </h1>
              <p className="text-sm text-gray-600">
                AI-Powered Expense Tracker
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Powered by</p>
              <p className="text-xs text-gray-500">OpenAI GPT-4 + Vision API</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 