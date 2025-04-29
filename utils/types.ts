export type Gender = 'male' | 'female' | 'other';
export type LookingFor = 'men' | 'women' | 'everyone';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  location: string;
  photos: string[];
  interests: string[];
  gender: Gender;
  lookingFor: LookingFor;
  lastActive: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Match {
  id: string;
  users: [string, string]; // IDs of the two matched users
  timestamp: string;
  lastMessage?: Message;
}

export interface Conversation {
  matchId: string;
  userId: string; // The other user's ID
  userName: string;
  userPhoto: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}