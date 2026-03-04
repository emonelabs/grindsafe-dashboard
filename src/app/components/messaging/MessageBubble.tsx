import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../../types/messaging';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  showSenderName: boolean;
  isGrouped: boolean;
}

export function MessageBubble({ 
  message, 
  isCurrentUser, 
  showAvatar, 
  showSenderName,
  isGrouped 
}: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isCurrentUser) {
    return (
      <div className={`flex justify-end ${isGrouped ? 'mt-1' : 'mt-4'}`}>
        <div className="flex flex-col items-end max-w-[70%]">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-md">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <span>{formatTime(message.timestamp)}</span>
            {message.status === 'sent' && <Check className="w-3 h-3" />}
            {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
            {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-2 ${isGrouped ? 'mt-1' : 'mt-4'}`}>
      {showAvatar ? (
        <img 
          src={message.senderAvatar} 
          alt={message.senderName}
          className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
        />
      ) : (
        <div className="w-8 h-8 flex-shrink-0" />
      )}
      <div className="flex flex-col max-w-[70%]">
        {showSenderName && (
          <span className="text-xs font-medium text-gray-600 mb-1 ml-1">
            {message.senderName}
          </span>
        )}
        <div className="bg-white border border-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-tl-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-400 mt-1 ml-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
