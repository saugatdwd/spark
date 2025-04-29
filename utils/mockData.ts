import { User, Message, Match, Conversation, Gender, LookingFor } from './types';

// Mock users for the app
export const getMockUsers = (): User[] => [
  {
    id: '1',
    name: 'Jessica Chen',
    email: 'jessica@example.com',
    age: 28,
    bio: 'Photographer and coffee enthusiast. Love exploring new cities and finding hidden gems.',
    location: 'San Francisco, CA',
    photos: [
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    ],
    interests: ['Photography', 'Travel', 'Coffee', 'Hiking'],
    gender: 'female',
    lookingFor: 'men',
    lastActive: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Michael Davis',
    email: 'michael@example.com',
    age: 32,
    bio: 'Software engineer by day, chef by night. Looking for someone to share my culinary experiments with.',
    location: 'Seattle, WA',
    photos: [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    ],
    interests: ['Cooking', 'Coding', 'Hiking', 'Movies'],
    gender: 'male',
    lookingFor: 'women',
    lastActive: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sophia Johnson',
    email: 'sophia@example.com',
    age: 27,
    bio: 'Yoga instructor and plant mom. Looking for someone who shares my passion for wellness and mindfulness.',
    location: 'Los Angeles, CA',
    photos: [
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    ],
    interests: ['Yoga', 'Meditation', 'Plants', 'Vegan Cooking'],
    gender: 'female',
    lookingFor: 'everyone',
    lastActive: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Ethan Wilson',
    email: 'ethan@example.com',
    age: 30,
    bio: 'Music producer and dog lover. Always on the hunt for the perfect sandwich and good conversation.',
    location: 'Austin, TX',
    photos: [
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    ],
    interests: ['Music', 'Dogs', 'Food', 'Concerts'],
    gender: 'male',
    lookingFor: 'women',
    lastActive: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    email: 'olivia@example.com',
    age: 25,
    bio: 'Art gallery curator with a love for vintage clothing and indie films. Looking for someone to explore museums with.',
    location: 'New York, NY',
    photos: [
      'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg',
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
    ],
    interests: ['Art', 'Fashion', 'Film', 'Museums'],
    gender: 'female',
    lookingFor: 'men',
    lastActive: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Daniel Kim',
    email: 'daniel@example.com',
    age: 29,
    bio: 'Architect and weekend surfer. Passionate about sustainable design and finding the perfect wave.',
    location: 'San Diego, CA',
    photos: [
      'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg',
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    ],
    interests: ['Architecture', 'Surfing', 'Sustainability', 'Travel'],
    gender: 'male',
    lookingFor: 'women',
    lastActive: new Date().toISOString(),
  },
];

// Generate mock matches
export const getMockMatches = (userId: string): Match[] => {
  const users = getMockUsers().filter(user => user.id !== userId);
  return users.slice(0, 3).map((user, index) => ({
    id: `match-${userId}-${user.id}`,
    users: [userId, user.id] as [string, string],
    timestamp: new Date(Date.now() - index * 86400000).toISOString(), // Each match is a day apart
    lastMessage: index < 2 ? getMockMessages(userId, user.id)[0] : undefined,
  }));
};

// Generate mock messages for a conversation
export const getMockMessages = (userId: string, otherId: string): Message[] => {
  const baseTime = Date.now();
  const messages: Message[] = [];

  const templates = [
    'Hey there! How\'s your day going?',
    'I noticed you like [interest]. That\'s awesome!',
    'What are you up to this weekend?',
    'Have you been to any good restaurants lately?',
    'I love your profile picture! Where was that taken?',
  ];

  // Generate 5 messages for this conversation
  for (let i = 0; i < 5; i++) {
    const isFromUser = i % 2 === 0;
    const time = new Date(baseTime - (5 - i) * 3600000); // Each message is an hour apart
    
    messages.push({
      id: `msg-${i}-${userId}-${otherId}`,
      senderId: isFromUser ? userId : otherId,
      receiverId: isFromUser ? otherId : userId,
      text: templates[i % templates.length].replace('[interest]', getMockUsers().find(u => u.id === otherId)?.interests[0] || 'travel'),
      timestamp: time.toISOString(),
      read: i < 4, // Only the latest message might be unread
    });
  }

  return messages.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Generate conversations list for the messages tab
export const getMockConversations = (userId: string): Conversation[] => {
  const matches = getMockMatches(userId);
  const allUsers = getMockUsers();
  
  return matches.map(match => {
    const otherUserId = match.users[0] === userId ? match.users[1] : match.users[0];
    const otherUser = allUsers.find(u => u.id === otherUserId);
    const messages = getMockMessages(userId, otherUserId);
    const lastMsg = messages[0]; // Most recent message
    
    return {
      matchId: match.id,
      userId: otherUserId,
      userName: otherUser?.name || 'Unknown User',
      userPhoto: otherUser?.photos[0] || '',
      lastMessage: lastMsg?.text,
      lastMessageTime: lastMsg?.timestamp,
      unreadCount: messages.filter(m => m.senderId === otherUserId && !m.read).length,
    };
  });
};

// Get potential matches for the discover tab
export const getPotentialMatches = (userId: string): User[] => {
  const currentUser = getMockUsers().find(u => u.id === userId);
  if (!currentUser) return [];
  
  let lookingFor: Gender[] = [];
  
  if (currentUser.lookingFor === 'men') {
    lookingFor = ['male'];
  } else if (currentUser.lookingFor === 'women') {
    lookingFor = ['female'];
  } else {
    lookingFor = ['male', 'female', 'other'];
  }
  
  // Filter users based on preferences
  return getMockUsers()
    .filter(user => 
      user.id !== userId && 
      lookingFor.includes(user.gender) &&
      (user.lookingFor === 'everyone' || 
       (user.lookingFor === 'men' && currentUser.gender === 'male') ||
       (user.lookingFor === 'women' && currentUser.gender === 'female'))
    );
};

// Get a list of ice breaker questions
export const getIceBreakers = (): string[] => [
  "What's one thing you can't start your day without?",
  "What's your idea of a perfect day?",
  "What's the last book that made you think differently?",
  "What's your favorite way to unwind after a long day?",
  "If you could travel anywhere tomorrow, where would you go?",
  "What's a skill you've always wanted to learn?",
  "What's your favorite meal to cook for someone special?",
  "What's something you're passionate about that surprises people?",
  "What's the best advice you've ever received?",
  "What three things would you bring to a desert island?",
];

// Get interests for user selection
export const getAvailableInterests = (): string[] => [
  'Travel', 'Photography', 'Cooking', 'Hiking', 'Reading',
  'Music', 'Art', 'Fitness', 'Movies', 'Dancing',
  'Writing', 'Yoga', 'Fashion', 'Technology', 'Sports',
  'Gaming', 'Foodie', 'Animals', 'Outdoors', 'Wine',
  'Coffee', 'Concerts', 'Theater', 'Volunteering', 'Languages',
  'Meditation', 'Cycling', 'Podcasts', 'Gardening', 'DIY',
];