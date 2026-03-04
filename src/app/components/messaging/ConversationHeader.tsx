import { Users } from 'lucide-react';
import { Conversation } from '../../types/messaging';

interface ConversationHeaderProps {
  conversation: Conversation;
}

export function ConversationHeader({ conversation }: ConversationHeaderProps) {
  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getStatusText = () => {
    if (conversation.type === 'channel') {
      return `${conversation.participants.length} members`;
    }
    
    // For DMs, show online status
    const otherParticipant = conversation.participants[0];
    if (otherParticipant.isOnline) {
      return <span className="text-green-600">Online</span>;
    }
    return `Last seen ${formatLastSeen(otherParticipant.lastSeen)}`;
  };

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        {conversation.type === 'channel' ? (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: conversation.teamColor || '#3b82f6' }}
          >
            {conversation.name.substring(0, 2).toUpperCase()}
          </div>
        ) : (
          <img 
            src={conversation.avatar} 
            alt={conversation.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">{conversation.name}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {conversation.type === 'channel' && <Users className="w-3 h-3" />}
            {getStatusText()}
          </p>
        </div>
      </div>
    </div>
  );
}
