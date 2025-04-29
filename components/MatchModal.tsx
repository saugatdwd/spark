import React, { useEffect } from 'react';
import { Modal, StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '@/utils/types';
import { colors, spacing, borderRadius } from '@/utils/theme';
import Text from './Text';
import Button from './Button';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { MessageCircle, X } from 'lucide-react-native';

interface MatchModalProps {
  visible: boolean;
  matchedUser: User | null;
  currentUser: User | null;
  onClose: () => void;
  onMessage: (user: User) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MatchModal({
  visible,
  matchedUser,
  currentUser,
  onClose,
  onMessage
}: MatchModalProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const photoLeftOffset = useSharedValue(-100);
  const photoRightOffset = useSharedValue(100);
  
  useEffect(() => {
    if (visible) {
      // Animate in
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1);
      photoLeftOffset.value = withDelay(300, withSpring(0));
      photoRightOffset.value = withDelay(300, withSpring(0));
    } else {
      // Reset values when hidden
      opacity.value = 0;
      scale.value = 0.8;
      photoLeftOffset.value = -100;
      photoRightOffset.value = 100;
    }
  }, [visible]);
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });
  
  const leftPhotoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: photoLeftOffset.value }],
    };
  });
  
  const rightPhotoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: photoRightOffset.value }],
    };
  });
  
  if (!matchedUser || !currentUser) return null;
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.modalContainer, containerStyle]}>
          <LinearGradient
            colors={[colors.primary[700], colors.secondary[700]]}
            style={styles.gradient}
          />
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.white} />
          </TouchableOpacity>
          
          <Text variant="heading1" color={colors.white} center style={styles.matchText}>
            It's a Match!
          </Text>
          
          <Text variant="body" color={colors.white} center style={styles.subtitle}>
            You and {matchedUser.name} liked each other
          </Text>
          
          <View style={styles.photosContainer}>
            <Animated.View style={[leftPhotoStyle]}>
              <Image
                source={{ uri: currentUser.photos[0] }}
                style={styles.photo}
              />
            </Animated.View>
            <Animated.View style={[rightPhotoStyle]}>
              <Image
                source={{ uri: matchedUser.photos[0] }}
                style={styles.photo}
              />
            </Animated.View>
          </View>
          
          <View style={styles.actionsContainer}>
            <Button
              title="Send a Message"
              onPress={() => {
                onClose();
                onMessage(matchedUser);
              }}
              icon={<MessageCircle size={20} color={colors.white} />}
              size="large"
              style={styles.messageButton}
            />
            
            <Button
              title="Keep Swiping"
              onPress={onClose}
              variant="outline"
              size="large"
              style={styles.continueButton}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH - spacing.xl * 2,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.l,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
    zIndex: 10,
  },
  matchText: {
    marginTop: spacing.xl,
    marginBottom: spacing.s,
  },
  subtitle: {
    marginBottom: spacing.xl,
    opacity: 0.9,
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.white,
    margin: -spacing.s,
  },
  actionsContainer: {
    gap: spacing.m,
  },
  messageButton: {
    backgroundColor: colors.primary[600],
  },
  continueButton: {
    borderColor: colors.white,
  },
});