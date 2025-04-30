import { borderRadius, colors, spacing, typography } from '@/utils/theme';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const scale = useSharedValue(1);
  
  // Scale animation for press feedback
  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // Determine styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    let variantStyle: ViewStyle = {};
    
    switch(variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: disabled ? colors.neutral[300] : colors.primary[600],
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: disabled ? colors.neutral[200] : colors.secondary[600],
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.neutral[300] : colors.primary[600],
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
        };
        break;
    }
    
    let sizeStyle: ViewStyle = {};
    
    switch(size) {
      case 'small':
        sizeStyle = {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.m,
          borderRadius: borderRadius.s,
        };
        break;
      case 'medium':
        sizeStyle = {
          paddingVertical: spacing.s,
          paddingHorizontal: spacing.l,
          borderRadius: borderRadius.m,
        };
        break;
      case 'large':
        sizeStyle = {
          paddingVertical: spacing.m,
          paddingHorizontal: spacing.xl,
          borderRadius: borderRadius.l,
        };
        break;
    }
    
    return {
      ...styles.button,
      ...variantStyle,
      ...sizeStyle,
    };
  };
  
  const getTextStyles = (): TextStyle => {
    let variantTextStyle: TextStyle = {};
    
    switch(variant) {
      case 'primary':
      case 'secondary':
        variantTextStyle = {
          color: colors.white,
        };
        break;
      case 'outline':
      case 'ghost':
        variantTextStyle = {
          color: disabled ? colors.neutral[400] : colors.primary[600],
        };
        break;
    }
    
    let sizeTextStyle: TextStyle = {};
    
    switch(size) {
      case 'small':
        sizeTextStyle = {
          fontSize: typography.sizes.s,
        };
        break;
      case 'medium':
        sizeTextStyle = {
          fontSize: typography.sizes.m,
        };
        break;
      case 'large':
        sizeTextStyle = {
          fontSize: typography.sizes.l,
        };
        break;
    }
    
    return {
      ...styles.text,
      ...variantTextStyle,
      ...sizeTextStyle,
    };
  };
  
  return (
    <AnimatedTouchable
      style={[getButtonStyles(), style, animatedStyle]}
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? colors.white : colors.primary[600]}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[getTextStyles(), textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.s,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  text: {
    fontFamily: typography.fonts.semibold,
    textAlign: 'center',
  },
});