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
      
 <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownLeft className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Money In</span>
            </div>
            <div className="text-xl font-bold text-green-600">${totalIn.toLocaleString()}</div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">Money Out</span>
            </div>
            <div className="text-xl font-bold text-red-600">${totalOut.toLocaleString()}</div>
          </div>

          <div className={`border rounded-lg p-3 ${
            netBalance >= 0 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {netBalance >= 0 ? (
                <TrendingUp className="w-4 h-4 text-blue-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-gray-600" />
              )}
              <span className={`text-xs font-medium ${
                netBalance >= 0 ? 'text-blue-700' : 'text-gray-700'
              }`}>Net Balance</span>
            </div>
            <div className={`text-xl font-bold ${
              netBalance >= 0 ? 'text-blue-600' : 'text-gray-600'
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
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <WalletIcon type={wallet.walletType} className="w-8 h-8" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{wallet.walletName}</div>
                    <div className="text-xs text-gray-500">{wallet.transactionCount} transactions</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${
                  wallet.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {wallet.netBalance >= 0 ? '+' : ''}${wallet.netBalance.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">In:</span>
                  <span className="font-semibold text-green-600">${wallet.totalIn.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Out:</span>
                  <span className="font-semibold text-red-600">${wallet.totalOut.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                  style={{ width: `${(wallet.totalIn / (wallet.totalIn + wallet.totalOut)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
