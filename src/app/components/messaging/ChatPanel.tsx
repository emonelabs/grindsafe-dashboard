import { useEffect, useRef } from 'react';
import { Conversation, Message, TypingUser } from '../../types/messaging';
import { ConversationHeader } from './ConversationHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface ChatPanelProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  typingUsers: TypingUser[];
  onSendMessage: (content: string) => void;
  onTyping: () => void;
}

export function ChatPanel({ 
  conversation, 
  messages, 
  currentUserId, 
  typingUsers,
  onSendMessage, 
  onTyping 
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-sm text-gray-500">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  const shouldGroupWithPrevious = (current: Message, previous: Message | null) => {
    if (!previous) return false;
    if (current.senderId !== previous.senderId) return false;
    
    const timeDiff = current.timestamp.getTime() - previous.timestamp.getTime();
    return timeDiff < 2 * 60 * 1000; // 2 minutes
  };

  const getDateDivider = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    
    if (messageDate.getTime() === today.getTime()) return 'Today';
    if (messageDate.getTime() === yesterday.getTime()) return 'Yesterday';
    
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Group messages by date
  const messagesByDate: { date: string; messages: Message[] }[] = [];
  let currentDate = '';
  
  messages.forEach((message) => {
    const dateStr = getDateDivider(message.timestamp);
    if (dateStr !== currentDate) {
      currentDate = dateStr;
      messagesByDate.push({ date: dateStr, messages: [message] });
    } else {
      messagesByDate[messagesByDate.length - 1].messages.push(message);
    }
  });

  const activeTypingUsers = typingUsers.filter(u => u.conversationId === conversation.id);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <ConversationHeader conversation={conversation} />
      
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4"
      >
        {messagesByDate.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-600">
                {group.date}
              </div>
            </div>
            
            {/* Messages */}
            {group.messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const previousMessage = index > 0 ? group.messages[index - 1] : null;
              const isGrouped = shouldGroupWithPrevious(message, previousMessage);
              const showAvatar = !isCurrentUser && (!isGrouped || !previousMessage);
              const showSenderName = conversation.type === 'channel' && !isCurrentUser && showAvatar;
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={isCurrentUser}
                  showAvatar={showAvatar}
                  showSenderName={showSenderName}
                  isGrouped={isGrouped}
                />
              );
            })}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {activeTypingUsers.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <span>{activeTypingUsers[0].userName} is typing</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <MessageInput onSendMessage={onSendMessage} onTyping={onTyping} />
    </div>
  );
}
