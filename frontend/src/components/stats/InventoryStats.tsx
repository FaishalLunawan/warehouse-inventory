'use client';

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { inventoryApi } from '@/lib/api';
import { InventoryStats as InventoryStatsType } from '@/types';
import StatsCard from './StatsCard';
import { formatCurrency } from '@/lib/utils';

export default function InventoryStats() {
  const [stats, setStats] = useState<InventoryStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await inventoryApi.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={loadStats}
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Items"
          value={stats.totalItems}
          icon={Package}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Value"
          value={formatCurrency(stats.totalValue)}
          icon={DollarSign}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Categories"
          value={stats.categories.length}
          icon={PieChart}
          color="purple"
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          color="orange"
          trend={{ value: -5, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-3">
            {stats.categories.slice(0, 5).map((category) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700">{category}</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.floor(Math.random() * 20) + 5} items
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
          {stats.lowStockItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">All items are sufficiently stocked</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{item.stock} units</p>
                    <p className="text-sm text-gray-600">Reorder needed</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}