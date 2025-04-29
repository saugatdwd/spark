import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { Conversation } from '@/utils/types';
import { getMockConversations } from '@/utils/mockData';
import Text from '@/components/Text';
import { formatMessageTime } from '@/utils/helpers';
import { Search, FileSliders as Sliders } from 'lucide-react-native';
import Input from '@/components/Input';

export default function MessagesScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);
  
  const fetchConversations = () => {
    // In a real app, this would be an API call
    const mockConversations = getMockConversations(user?.id || '');
    setConversations(mockConversations);
    setLoading(false);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => {
      fetchConversations();
      setRefreshing(false);
    }, 1000);
  };
  
  const handleOpenChat = (conversation: Conversation) => {
    router.push({
      pathname: '/(tabs)/messages/chat',
      params: { userId: conversation.userId }
    });
  };
  
  const filteredConversations = searchQuery
    ? conversations.filter(conv => 
        conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conv.lastMessage && conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : conversations;
  
  if (!user) {
    router.replace('/(auth)/welcome');
    return null;
  }
  
  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => handleOpenChat(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.userPhoto }} style={styles.avatar} />
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text variant="caption" color={colors.white} style={styles.unreadCount}>
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.conversationDetails}>
        <View style={styles.conversationHeader}>
          <Text variant="bodyBold" numberOfLines={1}>
            {item.userName}
          </Text>
          {item.lastMessageTime && (
            <Text variant="caption" color={colors.neutral[500]}>
              {formatMessageTime(item.lastMessageTime)}
            </Text>
          )}
        </View>
        
        <Text 
          variant="body" 
          color={item.unreadCount > 0 ? colors.neutral[800] : colors.neutral[500]} 
          numberOfLines={1}
          style={item.unreadCount > 0 ? styles.unreadMessage : {}}
        >
          {item.lastMessage || 'Start a conversation'}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text variant="body" color={colors.neutral[600]} center>
        {searchQuery ? 'No conversations match your search' : 'No conversations yet'}
      </Text>
      <Text variant="caption" color={colors.neutral[500]} center style={styles.emptySubtext}>
        {searchQuery 
          ? 'Try a different search term'
          : 'Start matching with people to begin conversations'}
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading2">Messages</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search conversations"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.neutral[500]} />}
          rightIcon={
            <TouchableOpacity>
              <Sliders size={20} color={colors.neutral[500]} />
            </TouchableOpacity>
          }
          containerStyle={styles.searchInputContainer}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderItem}
          keyExtractor={item => item.matchId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary[600]]}
              tintColor={colors.primary[600]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + spacing.s,
    paddingBottom: spacing.m,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  searchContainer: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    backgroundColor: colors.white,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.m,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary[600],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  unreadCount: {
    fontSize: 12,
    paddingHorizontal: 4,
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  unreadMessage: {
    fontFamily: typography.fonts.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptySubtext: {
    marginTop: spacing.s,
  },
});