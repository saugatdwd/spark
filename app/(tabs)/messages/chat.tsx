import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { Message, User } from '@/utils/types';
import { getMockMessages, getMockUsers } from '@/utils/mockData';
import Text from '@/components/Text';
import ChatMessage from '@/components/ChatMessage';
import { ArrowLeft, Send, Smile, Image as ImageIcon, Mic } from 'lucide-react-native';
import { formatLastActive } from '@/utils/helpers';

export default function ChatScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    if (!userId || !currentUser) return;
    
    // Get other user's info
    const users = getMockUsers();
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setOtherUser(foundUser);
    }
    
    // Get messages
    const foundMessages = getMockMessages(currentUser.id, userId);
    setMessages(foundMessages);
    
    // Simulate "read" status update for messages
    // In a real app, this would be an API call
  }, [userId, currentUser]);
  
  const sendMessage = () => {
    if (!inputText.trim() || !currentUser || !otherUser) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherUser.id,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Add to messages list
    setMessages(prevMessages => [newMessage, ...prevMessages]);
    setInputText('');
    
    // In a real app, this would be an API call to send the message
    
    // Simulate reply after a delay
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        const replyTexts = [
          "That's interesting!",
          "Tell me more about that.",
          "I'm not sure I understand. Can you explain?",
          "I'd love to hear your thoughts on this.",
          "That sounds great!",
        ];
        
        const replyMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: otherUser.id,
          receiverId: currentUser.id,
          text: replyTexts[Math.floor(Math.random() * replyTexts.length)],
          timestamp: new Date().toISOString(),
          read: false,
        };
        
        setIsTyping(false);
        setMessages(prevMessages => [replyMessage, ...prevMessages]);
      }, 2000);
    }, 1000);
  };
  
  const renderItem = ({ item }: { item: Message }) => (
    <ChatMessage
      text={item.text}
      timestamp={item.timestamp}
      isSender={item.senderId === currentUser?.id}
    />
  );
  
  if (!currentUser || !otherUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading conversation...</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.neutral[800]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => {
            // In a real app, navigate to user profile
          }}
        >
          <Image source={{ uri: otherUser.photos[0] }} style={styles.avatar} />
          <View>
            <Text variant="bodyBold">{otherUser.name}</Text>
            <Text variant="caption" color={colors.neutral[500]}>
              {formatLastActive(otherUser.lastActive)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />
      
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text variant="caption" color={colors.neutral[600]}>
            {otherUser.name} is typing...
          </Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <View style={styles.inputActions}>
          <TouchableOpacity style={styles.inputActionButton}>
            <ImageIcon size={24} color={colors.neutral[600]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputActionButton}>
            <Smile size={24} color={colors.neutral[600]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.neutral[400]}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>
        
        {inputText.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Send size={24} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micButton}>
            <Mic size={24} color={colors.neutral[600]} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xxl + spacing.s,
    paddingBottom: spacing.m,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.s,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.s,
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  typingIndicator: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.white,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputActionButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.l,
    paddingHorizontal: spacing.s,
    maxHeight: 100,
  },
  textInput: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.m,
    paddingVertical: spacing.xs,
    color: colors.neutral[800],
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
});