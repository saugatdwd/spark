import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { User } from '@/utils/types';
import { colors, spacing, borderRadius, shadows, typography } from '@/utils/theme';
import Text from './Text';
import { Heart, X, MessageCircle, MapPin } from 'lucide-react-native';

interface ProfileCardProps {
  user: User;
  onLike: (user: User) => void;
  onDislike: (user: User) => void;
  onMessage?: (user: User) => void;
  isMatch?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.xl * 2;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function ProfileCard({ 
  user, 
  onLike, 
  onDislike, 
  onMessage,
  isMatch = false
}: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const handleSwipeGesture = (event: any) => {
    translateX.value = event.translationX;
    rotation.value = translateX.value / 10;
  };
  
  const handleSwipeEnd = (event: any) => {
    const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
    const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
    
    if (shouldSwipeRight) {
      translateX.value = withSpring(SCREEN_WIDTH * 1.5);
      rotation.value = withSpring(15);
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(onLike)(user);
      });
    } else if (shouldSwipeLeft) {
      translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
      rotation.value = withSpring(-15);
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(onDislike)(user);
      });
    } else {
      translateX.value = withSpring(0);
      rotation.value = withSpring(0);
    }
  };
  
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });
  
  const likeStyle = useAnimatedStyle(() => {
    return {
      opacity: translateX.value > SWIPE_THRESHOLD / 2 ? 1 : 0,
    };
  });
  
  const dislikeStyle = useAnimatedStyle(() => {
    return {
      opacity: translateX.value < -SWIPE_THRESHOLD / 2 ? 1 : 0,
    };
  });
  
  const handlePhotoScroll = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPhotoIndex < user.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else if (direction === 'prev' && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };
  
  return (
    <PanGestureHandler
      onGestureEvent={handleSwipeGesture}
      onEnded={handleSwipeEnd}
      enabled={!isMatch}
    >
      <Animated.View style={[styles.container, cardStyle]}>
        {/* Photo Gallery */}
        <ImageBackground
          source={{ uri: user.photos[currentPhotoIndex] }}
          style={styles.photoBackground}
          imageStyle={styles.photo}
        >
          {/* Photo navigation dots */}
          <View style={styles.photoDots}>
            {user.photos.map((_, index) => (
              <View 
                key={`dot-${index}`} 
                style={[
                  styles.dot,
                  index === currentPhotoIndex && styles.activeDot
                ]} 
              />
            ))}
          </View>
          
          {/* Photo navigation controls */}
          <TouchableOpacity
            style={[styles.photoNavButton, styles.prevButton]}
            onPress={() => handlePhotoScroll('prev')}
            disabled={currentPhotoIndex === 0}
          >
            <View style={[styles.photoNavIndicator, currentPhotoIndex === 0 && styles.disabledNav]} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.photoNavButton, styles.nextButton]}
            onPress={() => handlePhotoScroll('next')}
            disabled={currentPhotoIndex === user.photos.length - 1}
          >
            <View style={[styles.photoNavIndicator, currentPhotoIndex === user.photos.length - 1 && styles.disabledNav]} />
          </TouchableOpacity>
          
          {/* Like/Dislike Indicators */}
          <Animated.View style={[styles.indicator, styles.likeIndicator, likeStyle]}>
            <Text variant="bodyBold" color={colors.white}>LIKE</Text>
          </Animated.View>
          
          <Animated.View style={[styles.indicator, styles.dislikeIndicator, dislikeStyle]}>
            <Text variant="bodyBold" color={colors.white}>NOPE</Text>
          </Animated.View>
          
          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          
          {/* User info overlay */}
          <View style={styles.userInfo}>
            <View style={styles.nameAgeContainer}>
              <Text variant="heading2" color={colors.white} style={styles.name}>
                {user.name}, {user.age}
              </Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color={colors.white} />
                <Text variant="caption" color={colors.white}>
                  {user.location}
                </Text>
              </View>
            </View>
            
            <View style={styles.interests}>
              {user.interests.slice(0, 3).map((interest, index) => (
                <View key={`interest-${index}`} style={styles.interestTag}>
                  <Text variant="caption" color={colors.primary[700]}>
                    {interest}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>
        
        {/* Action buttons */}
        {isMatch ? (
          <View style={styles.matchActionButtons}>
            <TouchableOpacity style={styles.messageButton} onPress={() => onMessage?.(user)}>
              <MessageCircle size={24} color={colors.primary[600]} />
              <Text variant="bodyBold" color={colors.primary[600]}>
                Message
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.dislikeButton]}
              onPress={() => {
                translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
                rotation.value = withSpring(-15);
                opacity.value = withTiming(0, { duration: 300 }, () => {
                  runOnJS(onDislike)(user);
                });
              }}
            >
              <X size={24} color={colors.error[500]} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => {
                translateX.value = withSpring(SCREEN_WIDTH * 1.5);
                rotation.value = withSpring(15);
                opacity.value = withTiming(0, { duration: 300 }, () => {
                  runOnJS(onLike)(user);
                });
              }}
            >
              <Heart size={24} color={colors.primary[600]} fill={colors.primary[600]} />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    overflow: 'hidden',
    ...shadows.lg,
    marginBottom: spacing.l,
  },
  photoBackground: {
    width: '100%',
    height: '100%',
  },
  photo: {
    borderRadius: borderRadius.xl,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  userInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.m,
  },
  nameAgeContainer: {
    flexDirection: 'column',
    marginBottom: spacing.s,
  },
  name: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.s,
  },
  interestTag: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  photoDots: {
    position: 'absolute',
    top: spacing.m,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: colors.white,
    width: 10,
  },
  photoNavButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '30%',
    zIndex: 1,
  },
  prevButton: {
    left: 0,
  },
  nextButton: {
    right: 0,
  },
  photoNavIndicator: {
    width: 0,
    height: 0,
  },
  disabledNav: {
    opacity: 0,
  },
  actionButtons: {
    position: 'absolute',
    bottom: spacing.m,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: spacing.m,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  likeButton: {
    backgroundColor: colors.white,
  },
  dislikeButton: {
    backgroundColor: colors.white,
  },
  indicator: {
    position: 'absolute',
    top: spacing.xl,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderWidth: 2,
    borderRadius: borderRadius.s,
    transform: [{ rotate: '-20deg' }],
  },
  likeIndicator: {
    right: spacing.l,
    borderColor: colors.primary[600],
    backgroundColor: 'rgba(236, 72, 153, 0.7)',
  },
  dislikeIndicator: {
    left: spacing.l,
    borderColor: colors.error[500],
    backgroundColor: 'rgba(239, 68, 68, 0.7)',
  },
  matchActionButtons: {
    position: 'absolute',
    bottom: spacing.m,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: borderRadius.round,
    ...shadows.md,
  },
});