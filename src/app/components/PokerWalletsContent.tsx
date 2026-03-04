import { useState } from 'react';
import { Copy, Edit, Trash2, Plus, CheckCircle, MoreVertical } from 'lucide-react';
import { WalletIcon } from './WalletIcon';
import { PaymentWallet } from './forms/PokerWalletForm';

interface PaymentWalletsContentProps {
  wallets: PaymentWallet[];
  onAdd: () => void;
  onEdit: (wallet: PaymentWallet) => void;
  onDelete: (walletId: string) => void;
}

export function PaymentWalletsContent({ wallets, onAdd, onEdit, onDelete }: PaymentWalletsContentProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = (wallet: PaymentWallet) => {
    if (window.confirm(`Are you sure you want to delete the ${wallet.provider} wallet for ${wallet.username}?`)) {
      onDelete(wallet.id);
    }
  };

  return (
    <div>
      {/* Wallets Table */}
      {wallets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No wallets yet</h3>
          <p className="text-gray-500 mb-4">Add your first payment wallet to get started</p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg 
                       hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Your First Wallet
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Wallets</h3>
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg 
                         hover:bg-gray-800 transition-colors font-medium text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Wallet
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Username</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Email</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Notes</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wallets.map((wallet) => (
                  <tr key={wallet.id} className="hover:bg-gray-50 transition-colors">
                    {/* Provider */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <WalletIcon type={wallet.provider} className="w-8 h-8" />
                        <span className="text-sm font-medium text-gray-900">{wallet.provider}</span>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-900">{wallet.username}</span>
                        <button
                          onClick={() => handleCopy(wallet.username, `${wallet.id}-username`)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy username"
                        >
                          {copiedField === `${wallet.id}-username` ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{wallet.email}</span>
                        <button
                          onClick={() => handleCopy(wallet.email, `${wallet.id}-email`)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy email"
                        >
                          {copiedField === `${wallet.id}-email` ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Balance */}
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {wallet.createdAt.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3">
                      {wallet.notes ? (
                        <span className="text-xs text-gray-600 max-w-xs truncate block" title={wallet.notes}>
                          {wallet.notes}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(wallet)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          title="Edit wallet"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(wallet)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete wallet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
