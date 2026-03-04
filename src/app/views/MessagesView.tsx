import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message, Participant, TypingUser } from '../types/messaging';
import { ConversationList } from '../components/messaging/ConversationList';
import { ChatPanel } from '../components/messaging/ChatPanel';

export default function MessagesView() {
  const currentUser = {
    id: 'user-marcus',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    role: 'player' as const
  };

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  // Generate mock data on mount
  useEffect(() => {
    const generatedConversations = generateMockConversations();
    setConversations(generatedConversations);
    
    // Auto-select first conversation
    if (generatedConversations.length > 0) {
      const firstConv = generatedConversations[0];
      setActiveConversationId(firstConv.id);
      setMessages(generateMessagesForConversation(firstConv.id, currentUser.id));
    }
  }, []);

  // Mark messages as read when conversation becomes active
  useEffect(() => {
    if (!activeConversationId) return;
    
    const timer = setTimeout(() => {
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      ));
      
      setMessages(prev => prev.map(msg => ({
        ...msg,
        status: 'read' as const
      })));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [activeConversationId]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance of new message
      if (Math.random() > 0.7 && conversations.length > 0) {
        const randomConv = conversations[Math.floor(Math.random() * conversations.length)];
        
        // Show typing indicator first
        const typingUser: TypingUser = {
          userId: randomConv.participants[0].id,
          userName: randomConv.participants[0].name,
          conversationId: randomConv.id
        };
        setTypingUsers(prev => [...prev, typingUser]);
        
        // Send message after 2 seconds
        setTimeout(() => {
          const newMessage = generateRandomMessage(randomConv.id, randomConv.participants[0]);
          
          // Add message to conversation
          if (randomConv.id === activeConversationId) {
            setMessages(prev => [...prev, newMessage]);
          }
          
          // Update conversation's last message
          setConversations(prev => prev.map(conv => {
            if (conv.id === randomConv.id) {
              return {
                ...conv,
                lastMessage: newMessage,
                unreadCount: conv.id === activeConversationId ? 0 : conv.unreadCount + 1
              };
            }
            return conv;
          }).sort((a, b) => {
            const aTime = a.lastMessage?.timestamp.getTime() || 0;
            const bTime = b.lastMessage?.timestamp.getTime() || 0;
            return bTime - aTime;
          }));
          
          // Remove typing indicator
          setTypingUsers(prev => prev.filter(u => u.userId !== typingUser.userId));
        }, 2000);
      }
    }, 25000); // Check every 25 seconds
    
    return () => clearInterval(interval);
  }, [conversations, activeConversationId]);

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setMessages(generateMessagesForConversation(conversationId, currentUser.id));
    
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const handleSendMessage = (content: string) => {
    if (!activeConversationId) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation's last message and move to top
    setConversations(prev => {
      const updated = prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, lastMessage: newMessage }
          : conv
      );
      
      // Sort by most recent
      return updated.sort((a, b) => {
        const aTime = a.lastMessage?.timestamp.getTime() || 0;
        const bTime = b.lastMessage?.timestamp.getTime() || 0;
        return bTime - aTime;
      });
    });
    
    // Simulate status changes
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
      ));
    }, 500);
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
      ));
    }, 1500);
  };

  const handleTyping = useCallback(() => {
    // Trigger typing indicator (would be sent to other users via WebSocket in real app)
    // For now, this is just a placeholder for future implementation
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  return (
    <div className="flex h-screen bg-gray-50">
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />
      <ChatPanel
        conversation={activeConversation}
        messages={messages}
        currentUserId={currentUser.id}
        typingUsers={typingUsers}
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
}

// Mock data generation functions
function generateMockConversations(): Conversation[] {
  const teams = [
    { id: 't1', name: 'High Rollers', color: '#3b82f6' },
    { id: 't2', name: 'Grinders', color: '#10b981' },
    { id: 't3', name: 'Night Owls', color: '#8b5cf6' },
    { id: 't4', name: 'Cash Kings', color: '#f59e0b' },
    { id: 't5', name: 'MTT Crushers', color: '#ef4444' }
  ];

  const players = [
    { id: 'user-sarah', name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
    { id: 'user-david', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { id: 'user-emma', name: 'Emma Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
    { id: 'user-james', name: 'James Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    { id: 'user-lisa', name: 'Lisa Thompson', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
    { id: 'user-michael', name: 'Michael Chang', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' },
    { id: 'user-anna', name: 'Anna Martinez', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400' },
    { id: 'user-tom', name: 'Tom Anderson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
    { id: 'user-nina', name: 'Nina Patel', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400' }
  ];

  const conversations: Conversation[] = [];

  // Create team channels
  teams.forEach(team => {
    const teamMembers: Participant[] = players.slice(0, 5).map(player => ({
      id: player.id,
      name: player.name,
      avatar: player.avatar,
      role: 'player' as const,
      isOnline: Math.random() > 0.5,
      lastSeen: new Date(Date.now() - Math.random() * 3600000 * 24)
    }));

    conversations.push({
      id: `conv-team-${team.id}`,
      type: 'channel',
      name: team.name,
      participants: teamMembers,
      unreadCount: Math.floor(Math.random() * 5),
      teamId: team.id,
      teamColor: team.color
    });
  });

  // Create DM conversations
  players.forEach(player => {
    const participant: Participant = {
      id: player.id,
      name: player.name,
      avatar: player.avatar,
      role: 'player' as const,
      isOnline: Math.random() > 0.5,
      lastSeen: new Date(Date.now() - Math.random() * 3600000 * 24)
    };

    conversations.push({
      id: `conv-dm-${player.id}`,
      type: 'direct',
      name: player.name,
      avatar: player.avatar,
      participants: [participant],
      unreadCount: Math.floor(Math.random() * 3)
    });
  });

  // Generate last messages for each conversation
  conversations.forEach(conv => {
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minsAgo = Math.floor(Math.random() * 60);
    
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);
    timestamp.setMinutes(timestamp.getMinutes() - minsAgo);

    conv.lastMessage = {
      id: `msg-last-${conv.id}`,
      conversationId: conv.id,
      senderId: conv.participants[0].id,
      senderName: conv.participants[0].name,
      senderAvatar: conv.participants[0].avatar,
      content: getRandomMessageContent(),
      timestamp,
      status: 'read'
    };
  });

  // Sort by most recent
  return conversations.sort((a, b) => {
    const aTime = a.lastMessage?.timestamp.getTime() || 0;
    const bTime = b.lastMessage?.timestamp.getTime() || 0;
    return bTime - aTime;
  });
}

function generateMessagesForConversation(conversationId: string, currentUserId: string): Message[] {
  const messageCount = 30 + Math.floor(Math.random() * 20);
  const messages: Message[] = [];
  
  // Get participants from the conversation (mock)
  const senderOptions = [
    { id: currentUserId, name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?w=400' },
    { id: 'user-other', name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
    { id: 'user-other2', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }
  ];

  for (let i = 0; i < messageCount; i++) {
    const daysAgo = Math.floor(i / 10);
    const hoursAgo = Math.floor(Math.random() * 12);
    const minsAgo = Math.floor(Math.random() * 60);
    
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - (7 - daysAgo));
    timestamp.setHours(timestamp.getHours() - hoursAgo);
    timestamp.setMinutes(timestamp.getMinutes() - minsAgo);

    const sender = i % 3 === 0 
      ? senderOptions[0] 
      : senderOptions[Math.floor(Math.random() * (senderOptions.length - 1)) + 1];

    messages.push({
      id: `msg-${conversationId}-${i}`,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      content: getRandomMessageContent(),
      timestamp,
      status: 'read'
    });
  }

  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

function generateRandomMessage(conversationId: string, participant: Participant): Message {
  return {
    id: `msg-${Date.now()}-${Math.random()}`,
    conversationId,
    senderId: participant.id,
    senderName: participant.name,
    senderAvatar: participant.avatar,
    content: getRandomMessageContent(),
    timestamp: new Date(),
    status: 'sent'
  };
}

function getRandomMessageContent(): string {
  const messages = [
    "Great session today! Up $450",
    "Anyone playing tonight?",
    "What stakes are you grinding?",
    "Let's review that hand later",
    "GL at the tables!",
    "Just had a sick cooler...",
    "Anyone free for a study session?",
    "That was a tough beat",
    "Running hot today 🔥",
    "What time are you starting?",
    "Need to work on my 3-bet defense",
    "That tournament was brutal",
    "Finally back to even for the month",
    "Who's playing the Sunday Million?",
    "Just moved up in stakes",
    "Taking a break, tilting a bit",
    "Best session of the year so far",
    "Let me know when you're free",
    "Thanks for the advice yesterday",
    "See you at the tables",
    "Good luck with your session!",
    "How did your MTT go?",
    "That was a great call",
    "Reviewing my HUD stats now",
    "Can we discuss that spot?",
    "I'm in for tonight's session",
    "Just finished a 6-hour grind",
    "Taking tomorrow off",
    "Need to improve my red line",
    "What's your win rate at 200nl?"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}
