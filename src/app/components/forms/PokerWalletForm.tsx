import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { WalletIcon } from '../WalletIcon';

export interface PaymentWallet {
  id: string;
  provider: 'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay';
  username: string;
  email: string;
  balance: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  notes?: string;
  ulid?: string;
}

interface PaymentWalletFormProps {
  onClose: () => void;
  onSubmit: (wallet: Omit<PaymentWallet, 'id' | 'createdAt'>) => void;
  editWallet?: PaymentWallet | null;
}

export default function PaymentWalletForm({ onClose, onSubmit, editWallet }: PaymentWalletFormProps) {
  const [provider, setProvider] = useState<'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay'>(
    editWallet?.provider || 'Skrill'
  );
  const [username, setUsername] = useState(editWallet?.username || '');
  const [email, setEmail] = useState(editWallet?.email || '');
  const [balance, setBalance] = useState(editWallet?.balance?.toString() || '0');
  const [notes, setNotes] = useState(editWallet?.notes || '');

  useEffect(() => {
    if (editWallet) {
      setProvider(editWallet.provider);
      setUsername(editWallet.username);
      setEmail(editWallet.email);
      setBalance(editWallet.balance.toString());
      setNotes(editWallet.notes || '');
    }
  }, [editWallet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      provider,
      username,
      email,
      balance: parseFloat(balance) || 0,
      status: 'active', // Always set to active when creating/editing
      notes: notes.trim() || undefined
    });
    
    onClose();
  };

  const providers: Array<'Skrill' | 'Neteller' | 'Pix' | 'LuxonPay'> = ['Skrill', 'Neteller', 'Pix', 'LuxonPay'];

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Wallet className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {editWallet ? 'Edit Payment Wallet' : 'Add Payment Wallet'}
          </h3>
          <p className="text-xs text-gray-500">
            {editWallet ? 'Update payment wallet credentials' : 'Add new payment wallet credentials'}
          </p>
        </div>
      </div>

      {/* Provider Selection */}
      <div>
        <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
          Payment Provider <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 gap-3">
          {providers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                provider === p
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <WalletIcon type={p} className="w-8 h-8" />
              <span className="text-xs font-medium text-gray-900">{p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          id="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                     outline-none transition-colors"
          placeholder="Enter username"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                     outline-none transition-colors"
          placeholder="email@example.com"
        />
      </div>

      {/* Balance */}
      <div>
        <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-2">
          Current Balance <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
          <input
            id="balance"
            type="number"
            required
            step="0.01"
            min="0"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                       outline-none transition-colors"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                     outline-none transition-colors resize-none"
          placeholder="Add any notes about this account..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 
                     rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg 
                     hover:bg-gray-800 transition-colors font-medium text-sm"
        >
          {editWallet ? 'Save Changes' : 'Add Wallet'}
        </button>
      </div>
    </form>
  );
}
