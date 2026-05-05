// components/common/WalletBalanceCard.tsx

import React from 'react';
import { Wallet, RefreshCw } from 'lucide-react';
import { Card } from '../ui/card';

interface WalletBalanceCardProps {
  balance: number;
  onRefresh?: () => void;
}

export function WalletBalanceCard({ balance, onRefresh }: WalletBalanceCardProps) {
  return (
    <Card className="bg-gradient-to-r from-[#F4A261] to-[#F4A261]/80 text-white shadow-lg border-0">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium mb-1">Wallet Balance</p>
            <p className="text-4xl font-bold">₹{balance.toFixed(2)}</p>
            <p className="text-white/70 text-xs mt-2">Available for shipping labels</p>
          </div>
          <div className="flex gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
            <div className="bg-white/20 p-3 rounded-full">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}