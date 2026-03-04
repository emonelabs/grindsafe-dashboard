import { useState } from 'react';
import { Copy, Edit, Trash2, Plus, CheckCircle } from 'lucide-react';
import { PokerWalletIcon } from './PokerWalletIcon';
import { PokerAccount } from './forms/PokerAccountForm';

interface PokerAccountsContentProps {
  accounts: PokerAccount[];
  onAdd: () => void;
  onEdit: (account: PokerAccount) => void;
  onDelete: (accountId: string) => void;
}

export function PokerAccountsContent({ accounts, onAdd, onEdit, onDelete }: PokerAccountsContentProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = (account: PokerAccount) => {
    if (window.confirm(`Are you sure you want to delete the ${account.pokerRoom} account "${account.nickname}"?`)) {
      onDelete(account.id);
    }
  };

  return (
    <div>
      {/* Accounts Table */}
      {accounts.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No accounts yet</h3>
          <p className="text-gray-500 mb-4">Add your first poker room account to get started</p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg 
                       hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Your First Account
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Accounts</h3>
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg 
                         hover:bg-gray-800 transition-colors font-medium text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Account
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Poker Room</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Nickname</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Notes</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                    {/* Poker Room */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <PokerWalletIcon platform={account.pokerRoom} size="sm" />
                        <span className="text-sm font-medium text-gray-900">{account.pokerRoom}</span>
                      </div>
                    </td>

                    {/* Nickname */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-900">{account.nickname}</span>
                        <button
                          onClick={() => handleCopy(account.nickname, `${account.id}-nickname`)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy nickname"
                        >
                          {copiedField === `${account.id}-nickname` ? (
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
                        <span className="text-sm text-gray-700">{account.email}</span>
                        <button
                          onClick={() => handleCopy(account.email, `${account.id}-email`)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy email"
                        >
                          {copiedField === `${account.id}-email` ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {account.createdAt.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3">
                      {account.notes ? (
                        <span className="text-xs text-gray-600 max-w-xs truncate block" title={account.notes}>
                          {account.notes}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(account)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          title="Edit account"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(account)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete account"
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
