import React, { useState } from 'react';
import { Repeat2 } from 'lucide-react';

interface SwapFormProps {
  onClose: () => void;
}

export default function SwapForm({ onClose }: SwapFormProps) {
  const [player, setPlayer] = useState('');
  const [swapType, setSwapType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Mock player data with stakes
  const mockPlayers = [
    { id: '1', name: 'John Smith', username: '@jsmith', stake: 500.00 },
    { id: '2', name: 'Sarah Johnson', username: '@sjohnson', stake: 750.00 },
    { id: '3', name: 'Mike Williams', username: '@mwilliams', stake: 1200.00 },
    { id: '4', name: 'Emily Davis', username: '@edavis', stake: 300.00 },
  ];

  const yourCurrentStake = 850.00;
  const selectedPlayer = mockPlayers.find(p => p.id === player);
  const theirCurrentStake = selectedPlayer?.stake || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API integration
    console.log('Swap request:', { 
      player, 
      swapType, 
      amount: swapType === 'partial' ? amount : null,
      notes 
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Icon and Description */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Repeat2 className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Swap Stakes</h3>
          <p className="text-xs text-gray-500">Swap stakes with another player</p>
        </div>
      </div>

      {/* Your Current Stake */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
        <div className="text-xs text-gray-600 font-medium mb-1">Your Current Stake</div>
        <div className="text-2xl font-bold text-gray-900">${yourCurrentStake.toFixed(2)}</div>
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
              {p.name} {p.username} - ${p.stake.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      {/* Their Current Stake Display */}
      {selectedPlayer && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-600 font-medium mb-1">Their Current Stake</div>
          <div className="text-2xl font-bold text-gray-900">${theirCurrentStake.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">{selectedPlayer.name}</div>
        </div>
      )}

      {/* Swap Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Swap Type <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="swapType"
              value="full"
              checked={swapType === 'full'}
              onChange={() => setSwapType('full')}
              className="w-4 h-4 text-gray-600 focus:ring-gray-400"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Full Swap</div>
              <div className="text-xs text-gray-500">Exchange entire stakes</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="swapType"
              value="partial"
              checked={swapType === 'partial'}
              onChange={() => setSwapType('partial')}
              className="w-4 h-4 text-gray-600 focus:ring-gray-400"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Partial Swap</div>
              <div className="text-xs text-gray-500">Exchange specific amounts</div>
            </div>
          </label>
        </div>
      </div>

      {/* Partial Swap Amount */}
      {swapType === 'partial' && (
        <div className="pl-4 border-l-2 border-gray-200">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Swap <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={Math.min(yourCurrentStake, theirCurrentStake)}
              required={swapType === 'partial'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
              placeholder="0.00"
            />
          </div>
          {amount && parseFloat(amount) > Math.min(yourCurrentStake, theirCurrentStake) && (
            <p className="text-xs text-red-500 mt-1">
              Amount exceeds the smaller stake (${Math.min(yourCurrentStake, theirCurrentStake).toFixed(2)})
            </p>
          )}
        </div>
      )}

      {/* Swap Preview */}
      {selectedPlayer && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="text-xs text-gray-600 font-medium mb-2">Swap Preview</div>
          
          {swapType === 'full' ? (
            <>
              <div className="space-y-1">
                <div className="text-xs text-gray-600">After swap, you will have:</div>
                <div className="text-lg font-bold text-gray-900">${theirCurrentStake.toFixed(2)}</div>
                <div className="text-xs text-gray-500">
                  {theirCurrentStake > yourCurrentStake ? '↑' : '↓'} 
                  {' '}${Math.abs(theirCurrentStake - yourCurrentStake).toFixed(2)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-600">They will have:</div>
                <div className="text-lg font-bold text-gray-900">${yourCurrentStake.toFixed(2)}</div>
                <div className="text-xs text-gray-500">
                  {yourCurrentStake > theirCurrentStake ? '↑' : '↓'} 
                  {' '}${Math.abs(yourCurrentStake - theirCurrentStake).toFixed(2)}
                </div>
              </div>
            </>
          ) : (
            amount && parseFloat(amount) > 0 && (
              <>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">Your new stake:</div>
                  <div className="text-lg font-bold text-gray-900">
                    ${(yourCurrentStake - parseFloat(amount) + parseFloat(amount)).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Swapping ${parseFloat(amount).toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">Their new stake:</div>
                  <div className="text-lg font-bold text-gray-900">
                    ${(theirCurrentStake - parseFloat(amount) + parseFloat(amount)).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Swapping ${parseFloat(amount).toFixed(2)}</div>
                </div>
              </>
            )
          )}
        </div>
      )}

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
          placeholder="Add any additional notes about this swap..."
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
          disabled={
            !player || 
            (swapType === 'partial' && (!amount || parseFloat(amount) > Math.min(yourCurrentStake, theirCurrentStake)))
          }
          className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request Swap
        </button>
      </div>
    </form>
  );
}
