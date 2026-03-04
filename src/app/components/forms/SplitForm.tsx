import React, { useState } from 'react';
import { Split } from 'lucide-react';

interface SplitFormProps {
  onClose: () => void;
}

export default function SplitForm({ onClose }: SplitFormProps) {
  const [player, setPlayer] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [yourPercentage, setYourPercentage] = useState('50');
  const [theirPercentage, setTheirPercentage] = useState('50');
  const [reason, setReason] = useState('');

  // Mock player list
  const mockPlayers = [
    { id: '1', name: 'John Smith', username: '@jsmith' },
    { id: '2', name: 'Sarah Johnson', username: '@sjohnson' },
    { id: '3', name: 'Mike Williams', username: '@mwilliams' },
    { id: '4', name: 'Emily Davis', username: '@edavis' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API integration
    console.log('Split request:', { 
      player, 
      totalAmount, 
      splitType, 
      yourPercentage: splitType === 'equal' ? 50 : yourPercentage,
      theirPercentage: splitType === 'equal' ? 50 : theirPercentage,
      reason 
    });
    onClose();
  };

  const handleYourPercentageChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setYourPercentage(value);
    setTheirPercentage((100 - numValue).toString());
  };

  const handleTheirPercentageChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setTheirPercentage(value);
    setYourPercentage((100 - numValue).toString());
  };

  const yourAmount = totalAmount && splitType === 'custom' 
    ? (parseFloat(totalAmount) * parseFloat(yourPercentage) / 100).toFixed(2)
    : totalAmount ? (parseFloat(totalAmount) / 2).toFixed(2) : '0.00';

  const theirAmount = totalAmount && splitType === 'custom'
    ? (parseFloat(totalAmount) * parseFloat(theirPercentage) / 100).toFixed(2)
    : totalAmount ? (parseFloat(totalAmount) / 2).toFixed(2) : '0.00';

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Icon and Description */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Split className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Split Balance</h3>
          <p className="text-xs text-gray-500">Split balance with another player</p>
        </div>
      </div>

      {/* Player Selection */}
      <div>
        <label htmlFor="player" className="block text-sm font-medium text-gray-700 mb-2">
          Select Player <span className="text-red-500">*</span>
        </label>
        <select
          id="player"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors bg-white"
        >
          <option value="">Choose a player...</option>
          {mockPlayers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} {p.username}
            </option>
          ))}
        </select>
      </div>

      {/* Total Amount */}
      <div>
        <label htmlFor="total-amount" className="block text-sm font-medium text-gray-700 mb-2">
          Total Amount to Split <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            id="total-amount"
            type="number"
            step="0.01"
            min="0"
            required
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Split Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Split Type <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="splitType"
              value="equal"
              checked={splitType === 'equal'}
              onChange={() => setSplitType('equal')}
              className="w-4 h-4 text-gray-600 focus:ring-gray-400"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Equal Split (50/50)</div>
              <div className="text-xs text-gray-500">Split the amount equally</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="splitType"
              value="custom"
              checked={splitType === 'custom'}
              onChange={() => setSplitType('custom')}
              className="w-4 h-4 text-gray-600 focus:ring-gray-400"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Custom Ratio</div>
              <div className="text-xs text-gray-500">Set custom percentage split</div>
            </div>
          </label>
        </div>
      </div>

      {/* Custom Ratio Inputs */}
      {splitType === 'custom' && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="your-percentage" className="block text-sm font-medium text-gray-700 mb-2">
                Your %
              </label>
              <div className="relative">
                <input
                  id="your-percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={yourPercentage}
                  onChange={(e) => handleYourPercentageChange(e.target.value)}
                  className="w-full px-4 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
              </div>
            </div>
            <div>
              <label htmlFor="their-percentage" className="block text-sm font-medium text-gray-700 mb-2">
                Their %
              </label>
              <div className="relative">
                <input
                  id="their-percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={theirPercentage}
                  onChange={(e) => handleTheirPercentageChange(e.target.value)}
                  className="w-full px-4 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
              </div>
            </div>
          </div>
          {parseFloat(yourPercentage) + parseFloat(theirPercentage) !== 100 && (
            <p className="text-xs text-red-500">Percentages must add up to 100%</p>
          )}
        </div>
      )}

      {/* Split Preview */}
      {totalAmount && parseFloat(totalAmount) > 0 && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="text-xs text-gray-600 font-medium mb-2">Split Preview</div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">You receive:</span>
            <span className="text-lg font-bold text-gray-900">${yourAmount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">They receive:</span>
            <span className="text-lg font-bold text-gray-900">${theirAmount}</span>
          </div>
        </div>
      )}

      {/* Reason Field */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
          Reason <span className="text-gray-400 text-xs">(Optional)</span>
        </label>
        <textarea
          id="reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors resize-none"
          placeholder="Why are you splitting this balance?"
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
          disabled={splitType === 'custom' && parseFloat(yourPercentage) + parseFloat(theirPercentage) !== 100}
          className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Split Balance
        </button>
      </div>
    </form>
  );
}
