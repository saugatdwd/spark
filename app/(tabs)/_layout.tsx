import React from 'react';
import { Tabs } from 'expo-router';
import { colors, typography } from '@/utils/theme';
import { Heart, MessageCircle, User, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarLabelStyle: {
          fontFamily: typography.fonts.medium,
          fontSize: typography.sizes.xs,
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index" // This is the discover/match tab
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}