import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { WalletIcon } from './WalletIcon';

interface WalletTransaction {
  walletName: string;
  walletType: 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay';
  totalIn: number;
  totalOut: number;
  netBalance: number;
  transactionCount: number;
}

export function WalletPerformance() {
  const [wallets, setWallets] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    // Generate mock wallet performance data
    const mockWallets: WalletTransaction[] = [
      {
        walletName: 'Main Skrill',
        walletType: 'Skrill',
        totalIn: 45230,
        totalOut: 28450,
        netBalance: 16780,
        transactionCount: 47
      },
      {
        walletName: 'Brazil Pix',
        walletType: 'Pix',
        totalIn: 32100,
        totalOut: 19800,
        netBalance: 12300,
        transactionCount: 34
      },
      {
        walletName: 'Euro Neteller',
        walletType: 'Neteller',
        totalIn: 18950,
        totalOut: 15200,
        netBalance: 3750,
        transactionCount: 28
      },
      {
        walletName: 'LuxonPay Pro',
        walletType: 'LuxonPay',
        totalIn: 12400,
        totalOut: 8900,
        netBalance: 3500,
        transactionCount: 19
      }
    ];

    setWallets(mockWallets);
  }, []);

  const totalIn = wallets.reduce((sum, w) => sum + w.totalIn, 0);
  const totalOut = wallets.reduce((sum, w) => sum + w.totalOut, 0);
  const netBalance = totalIn - totalOut;

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-gray-600" />
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Wallet Performance</h3>
        </div>
        <span className="text-[10px] text-gray-500">{wallets.length} wallets</span>
      </div>
      
      <div className="p-3 space-y-3">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <ArrowDownLeft className="w-3 h-3 text-gray-600" />
              <span className="text-[10px] font-medium text-gray-600">In</span>
            </div>
            <div className="text-sm font-bold text-gray-900">${totalIn.toLocaleString()}</div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <ArrowUpRight className="w-3 h-3 text-gray-600" />
              <span className="text-[10px] font-medium text-gray-600">Out</span>
            </div>
            <div className="text-sm font-bold text-gray-900">${totalOut.toLocaleString()}</div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-gray-600" />
              <span className="text-[10px] font-medium text-gray-600">Net</span>
            </div>
            <div className={`text-sm font-bold ${
              netBalance >= 0 ? 'text-gray-900' : 'text-gray-600'
            }`}>
              {netBalance >= 0 ? '+' : ''}${netBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Individual Wallets */}
        <div className="space-y-2">
          {wallets.map((wallet, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <WalletIcon type={wallet.walletType} className="w-6 h-6" />
                  <div>
                    <div className="text-xs font-semibold text-gray-900">{wallet.walletName}</div>
                    <div className="text-[10px] text-gray-500">{wallet.transactionCount} txns</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                  <span className="text-gray-500">In:</span>
                  <span className="font-semibold text-gray-900">${wallet.totalIn.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                  <span className="text-gray-500">Out:</span>
                  <span className="font-semibold text-gray-900">${wallet.totalOut.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
