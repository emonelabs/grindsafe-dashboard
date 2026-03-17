import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { PokerWalletIcon } from '../PokerWalletIcon';

export interface PokerAccount {
  id: string;
  pokerRoom: 'PokerStars' | 'GGPoker' | 'PartyPoker';
  nickname: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  notes?: string;
  ulid?: string;
}

interface PokerAccountFormProps {
  onClose: () => void;
  onSubmit: (account: Omit<PokerAccount, 'id' | 'createdAt'>) => void;
  editAccount?: PokerAccount | null;
}

export default function PokerAccountForm({ onClose, onSubmit, editAccount }: PokerAccountFormProps) {
  const [pokerRoom, setPokerRoom] = useState<'PokerStars' | 'GGPoker' | 'PartyPoker'>(
    editAccount?.pokerRoom || 'PokerStars'
  );
  const [nickname, setNickname] = useState(editAccount?.nickname || '');
  const [email, setEmail] = useState(editAccount?.email || '');
  const [notes, setNotes] = useState(editAccount?.notes || '');

  useEffect(() => {
    if (editAccount) {
      setPokerRoom(editAccount.pokerRoom);
      setNickname(editAccount.nickname);
      setEmail(editAccount.email);
      setNotes(editAccount.notes || '');
    }
  }, [editAccount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      pokerRoom,
      nickname,
      email,
      status: 'active', // Always set to active when creating/editing
      notes: notes.trim() || undefined
    });
    
    onClose();
  };

  const pokerRooms: Array<'PokerStars' | 'GGPoker' | 'PartyPoker'> = ['PokerStars', 'GGPoker', 'PartyPoker'];

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Users className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {editAccount ? 'Edit Poker Account' : 'Add Poker Account'}
          </h3>
          <p className="text-xs text-gray-500">
            {editAccount ? 'Update poker room account' : 'Add new poker room account'}
          </p>
        </div>
      </div>

      {/* Poker Room Selection */}
      <div>
        <label htmlFor="pokerRoom" className="block text-sm font-medium text-gray-700 mb-2">
          Poker Room <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {pokerRooms.map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => setPokerRoom(room)}
              className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                pokerRoom === room
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <PokerWalletIcon platform={room} size="sm" />
              <span className="text-xs font-medium text-gray-900">{room}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nickname */}
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
          Nickname <span className="text-red-500">*</span>
        </label>
        <input
          id="nickname"
          type="text"
          required
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                     outline-none transition-colors"
          placeholder="Enter poker nickname"
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
          {editAccount ? 'Save Changes' : 'Add Account'}
        </button>
      </div>
    </form>
  );
}
