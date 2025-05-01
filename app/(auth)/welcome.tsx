import React from 'react';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { colors, spacing, typography } from '@/utils/theme';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { Heart } from 'lucide-react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  
  // Heartbeat animation
  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1.15, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withDelay(1000, withTiming(1, { duration: 100 }))
      ),
      -1, 
      true 
    );
    
    rotate.value = withRepeat(
      withTiming(360, { duration: 60000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);
  
  const heartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const backgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundGradient, backgroundStyle]}>
        <LinearGradient
          colors={[
            colors.primary[300],
            colors.primary[500],
            colors.secondary[500],
            colors.secondary[700],
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
      
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.logoContainer, heartStyle]}>
          <Heart size={72} color={colors.white} fill={colors.white} />
        </Animated.View>
        
        <Text variant="heading1" color={colors.white} center style={styles.title}>
          Spark
        </Text>
        
        <Text variant="body" color={colors.white} center style={styles.subtitle}>
          Find meaningful connections with people who share your interests
        </Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <Link href="/(auth)/login" asChild>
          <Button
            title="Log In"
            variant="outline"
            size="large"
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
            onPress={() => {}}
          />
        </Link>
        
        <Link href="/(auth)/signup" asChild>
          <Button
            title="Create Account"
            size="large"
            textStyle={styles.signupButton}
            onPress={() => {
              router.push('/(auth)/signup');
            }}
          />
        </Link>
        
        <Text variant="caption" color={colors.white} center style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[800],
  },
  backgroundGradient: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    top: -height / 2,
    left: -width / 2,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.m,
    fontFamily: typography.fonts.heading,
    fontSize: 48,
    padding:spacing.s,
  },
  subtitle: {
    opacity: 0.8,
  },
  actionsContainer: {
    padding: spacing.xl,
    gap: spacing.m,
  },
  loginButton: {
    borderColor: colors.white,
    backgroundColor: 'transparent',
  },
  loginButtonText: {
    color: colors.white,
  },
  signupButton: {
    color: colors.white,
  },
  terms: {
    marginTop: spacing.m,
    opacity: 0.7,
  },
});