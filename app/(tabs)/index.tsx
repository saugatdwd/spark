import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/utils/types';
import { getPotentialMatches, getIceBreakers } from '@/utils/mockData';
import ProfileCard from '@/components/ProfileCard';
import Text from '@/components/Text';
import MatchModal from '@/components/MatchModal';
import { Heart, RefreshCw, Sparkles } from 'lucide-react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function DiscoverScreen() {
  const { user } = useAuth();
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [icebreaker, setIcebreaker] = useState('');
  
  useEffect(() => {
    
    // if (!user) {
    //   router.replace('/(auth)/welcome');
    //   return;
    // }
    
    // Fetch potential matches
    const matches = getPotentialMatches(user?.id);
    setPotentialMatches(matches);
    setLoading(false);
    
    // Set random icebreaker
    const icebreakers = getIceBreakers();
    setIcebreaker(icebreakers[Math.floor(Math.random() * icebreakers.length)]);
  }, [user]);
  
  const handleLike = (likedUser: User) => {
    // In a real app, this would call an API to register the like
    
    // Simulate a match (50% chance)
    const isMatch = Math.random() > 0.5;
    
    if (isMatch) {
      setMatchedUser(likedUser);
      setShowMatchModal(true);
    }
    
    // Move to next potential match
    setCurrentIndex(prevIndex => prevIndex + 1);
  };
  
  const handleDislike = () => {
    // In a real app, this would call an API to register the dislike
    
    // Move to next potential match
    setCurrentIndex(prevIndex => prevIndex + 1);
  };
  
  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Shuffle the order of potential matches
      const shuffled = [...potentialMatches].sort(() => 0.5 - Math.random());
      setPotentialMatches(shuffled);
      setCurrentIndex(0);
      setLoading(false);
      
      // Set new random icebreaker
      const icebreakers = getIceBreakers();
      setIcebreaker(icebreakers[Math.floor(Math.random() * icebreakers.length)]);
    }, 1000);
  };
  
  const goToChat = (matchedUser: User) => {
    // Navigate to chat with this user
    router.push({
      pathname: '/(tabs)/messages/chat',
      params: { userId: matchedUser.id }
    });
  };
  
  const currentUser = potentialMatches[currentIndex];
  const hasMoreUsers = currentIndex < potentialMatches.length;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Heart size={24} color={colors.primary[600]} fill={colors.primary[600]} />
          <Text variant="heading3" color={colors.primary[600]}>
            Spark
          </Text>
        </View>
        
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <RefreshCw size={24} color={colors.neutral[700]} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[600]} />
            <Text variant="body" style={styles.loadingText}>
              Finding potential matches...
            </Text>
          </View>
        ) : hasMoreUsers ? (
          <>
            <ProfileCard
              user={currentUser}
              onLike={handleLike}
              onDislike={handleDislike}
            />
            
            <View style={styles.icebreakerContainer}>
              <View style={styles.icebreakerHeader}>
                <Sparkles size={16} color={colors.secondary[600]} />
                <Text variant="label" color={colors.secondary[600]}>
                  ICEBREAKER
                </Text>
              </View>
              <Text variant="body" style={styles.icebreakerText}>
                {icebreaker}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Heart size={48} color={colors.neutral[300]} />
            <Text variant="heading3" style={styles.emptyTitle}>
              No More Profiles
            </Text>
            <Text variant="body" color={colors.neutral[600]} center style={styles.emptyText}>
              We've run out of potential matches for now. Check back later or adjust your preferences.
            </Text>
            <TouchableOpacity
              style={styles.refreshButtonLarge}
              onPress={handleRefresh}
            >
              <RefreshCw size={20} color={colors.white} />
              <Text variant="bodyBold" color={colors.white}>
                Refresh
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <MatchModal
        visible={showMatchModal}
        matchedUser={matchedUser}
        currentUser={user}
        onClose={() => setShowMatchModal(false)}
        onMessage={goToChat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + spacing.s,
    paddingBottom: spacing.m,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.m,
    color: colors.neutral[600],
  },
  icebreakerContainer: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.m,
    marginTop: spacing.m,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  icebreakerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  icebreakerText: {
    color: colors.neutral[800],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  emptyText: {
    marginBottom: spacing.l,
  },
  refreshButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    borderRadius: 30,
    gap: spacing.s,
  },
});