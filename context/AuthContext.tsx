import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMockUsers } from '@/utils/mockData';
import { User } from '@/utils/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: Partial<User>) => Promise<void>;
  signOut: () => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  updateUserProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log(user)

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // In a real app, check async storage or secure store for tokens
        // For demo, we're just simulating a loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to get auth state:', error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Handle navigation after loading state changes
  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.replace('/(auth)/welcome');
  //   }
  // }, [isLoading, user]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in a real app, call your auth API
      const mockUsers = getMockUsers();
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send this data to your API
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        age: userData.age || 25,
        bio: userData.bio || '',
        location: userData.location || 'New York, NY',
        photos: userData.photos || [
          'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        ],
        interests: userData.interests || [],
        gender: userData.gender || 'other',
        lookingFor: userData.lookingFor || 'everyone',
        lastActive: new Date().toISOString(),
      };
      
      setUser(newUser);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    // In a real app, clear tokens from storage
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        signIn, 
        signUp, 
        signOut, 
        updateUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};