import React from 'react';
import { format } from 'date-fns';
import { DollarSign, Receipt, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardStats, ReceiptData } from '../types';

interface DashboardProps {
  stats: DashboardStats | null;
  receipts: ReceiptData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const Dashboard: React.FC<DashboardProps> = ({ stats, receipts }) => {
  if (!stats) {
    return (
      <div className="card">
        <p className="text-gray-600 text-center">Loading dashboard...</p>
      </div>
    );
  }

  const recentReceipts = receipts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalSpent.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Receipts</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalReceipts}
              </p>
            </div>
            <Receipt className="h-8 w-8 text-success-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. per Receipt</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalReceipts > 0 ? (stats.totalSpent / stats.totalReceipts).toFixed(2) : '0.00'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-warning-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.monthlySpending.length > 0 
                  ? stats.monthlySpending[stats.monthlySpending.length - 1]?.amount.toFixed(2) || '0.00'
                  : '0.00'
                }
              </p>
            </div>
            <Calendar className="h-8 w-8 text-danger-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => format(new Date(value), 'MMM')}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                labelFormatter={(label) => format(new Date(label), 'MMMM yyyy')}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {stats.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Receipts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Receipts</h3>
        {recentReceipts.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No receipts uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {recentReceipts.map((receipt) => (
              <div key={receipt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{receipt.parsedData.merchant}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(receipt.parsedData.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${receipt.parsedData.total.toFixed(2)}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                    {receipt.parsedData.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 