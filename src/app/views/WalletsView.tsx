import { useState } from 'react';
import { Wallet, Plus, Trash2, CreditCard, X } from 'lucide-react';
import { WalletIcon, walletColors } from '../components/WalletIcon';

interface WalletItem {
  id: string;
  name: string;
  type: 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay';
  accountId: string;
  createdAt: Date;
  isActive: boolean;
}

const walletTypes = ['Skrill', 'Neteller', 'Pix', 'LuxonPay'] as const;

export function WalletsView() {
  const [wallets, setWallets] = useState<WalletItem[]>([
    {
      id: '1',
      name: 'Main Skrill',
      type: 'Skrill',
      accountId: 'player@email.com',
      createdAt: new Date('2024-01-15'),
      isActive: true
    },
    {
      id: '2',
      name: 'Brazil Pix',
      type: 'Pix',
      accountId: '+55 11 98765-4321',
      createdAt: new Date('2024-02-20'),
      isActive: true
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    type: 'Skrill' as typeof walletTypes[number],
    accountId: ''
  });

  const handleCreate = () => {
    if (!newWallet.name || !newWallet.accountId) {
      alert('Please fill in all fields');
      return;
    }

    const wallet: WalletItem = {
      id: Date.now().toString(),
      name: newWallet.name,
      type: newWallet.type,
      accountId: newWallet.accountId,
      createdAt: new Date(),
      isActive: true
    };

    setWallets([...wallets, wallet]);
    setIsModalOpen(false);
    setNewWallet({ name: '', type: 'Skrill', accountId: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this wallet?')) {
      setWallets(wallets.filter(w => w.id !== id));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Payment Wallets</h1>
          <p className="text-gray-500 text-sm">Manage payment methods for splits and withdrawals</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Wallet
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Wallets</span>
            <Wallet className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{wallets.length}</div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active</span>
            <CreditCard className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{wallets.filter(w => w.isActive).length}</div>
        </div>

        {walletTypes.map(type => (
          <div key={type} className="bg-white border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{type}</span>
              <WalletIcon type={type} className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{wallets.filter(w => w.type === type).length}</div>
          </div>
        )).slice(0, 2)}
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map(wallet => (
          <div
            key={wallet.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Card Header with Gradient */}
            <div className={`bg-gradient-to-r ${walletColors[wallet.type]} p-6 text-white`}>
              <div className="flex items-start justify-between mb-4">
                <WalletIcon type={wallet.type} className="w-12 h-12" />
                <button
                  onClick={() => handleDelete(wallet.id)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">{wallet.name}</h3>
                <p className="text-sm text-white/80">{wallet.type}</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account ID</span>
                <p className="text-sm font-mono font-semibold text-gray-900 mt-1">{wallet.accountId}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-500">Created</span>
                  <p className="text-xs font-medium text-gray-900">{formatDate(wallet.createdAt)}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  wallet.isActive ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${wallet.isActive ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                  {wallet.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all min-h-[280px]"
        >
          <Plus className="w-12 h-12 mb-3" />
          <p className="font-semibold">Add New Wallet</p>
        </button>
      </div>

      {/* Empty State */}
      {wallets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Wallets Yet</h3>
          <p className="text-gray-500 mb-4">Add your first payment wallet to get started</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Wallet
          </button>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add New Wallet</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={newWallet.name}
                  onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                  placeholder="e.g., Main Skrill, Brazil Pix"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Type
                </label>
                <select
                  value={newWallet.type}
                  onChange={(e) => setNewWallet({ ...newWallet, type: e.target.value as typeof walletTypes[number] })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  {walletTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account ID / Email / Phone
                </label>
                <input
                  type="text"
                  value={newWallet.accountId}
                  onChange={(e) => setNewWallet({ ...newWallet, accountId: e.target.value })}
                  placeholder="account@email.com or +1234567890"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Create Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
