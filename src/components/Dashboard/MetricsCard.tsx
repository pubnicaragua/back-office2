import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export function MetricsCard({ title, value, change, isPositive }: MetricsCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{change}</span>
            </div>
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}