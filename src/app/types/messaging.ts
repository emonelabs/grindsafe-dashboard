export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  type: 'direct' | 'channel';
  name: string;
  avatar?: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  teamId?: string;
  teamColor?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'player';
  isOnline: boolean;
  lastSeen: Date;
}

export interface TypingUser {
  userId: string;
  userName: string;
  conversationId: string;
}
