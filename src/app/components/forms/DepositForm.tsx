import React, { useState } from 'react';
import { ArrowDownRight } from 'lucide-react';

interface DepositFormProps {
  onClose: () => void;
}

export default function DepositForm({ onClose }: DepositFormProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API integration
    console.log('Deposit request:', { amount, currency, paymentMethod, notes });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Icon and Description */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <ArrowDownRight className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Request Deposit</h3>
          <p className="text-xs text-gray-500">Add funds to your balance</p>
        </div>
      </div>

      {/* Amount Field */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Currency Field */}
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
          Currency <span className="text-red-500">*</span>
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors bg-white"
        >
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="CAD">CAD - Canadian Dollar</option>
        </select>
      </div>

      {/* Payment Method */}
      <div>
        <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <select
          id="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors bg-white"
        >
          <option value="credit-card">Credit Card</option>
          <option value="bank-transfer">Bank Transfer</option>
          <option value="crypto">Cryptocurrency</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {/* Notes Field */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes <span className="text-gray-400 text-xs">(Optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors resize-none"
          placeholder="Add any additional notes..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
        >
          Request Deposit
        </button>
      </div>
    </form>
  );
}
