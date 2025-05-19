import { Platform } from 'react-native';

// Define a scale theme with 8px as base
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const colors = {
  // Primary colors
  primary: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },
  
  // Secondary colors (purple tones)
  secondary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  
  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Feedback colors
  success: {
    50: '#ECFDF5',
    500: '#10B981',
    700: '#047857',
  },
  
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    700: '#B45309',
  },
  
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    700: '#B91C1C',
  },
  
  // Additional colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const typography = {
  fonts: {
    heading: Platform.select({
      ios: 'Playfair-Bold',
      android: 'Playfair-Bold',
      default: 'Playfair-Bold',
    }),
    body: Platform.select({
      ios: 'Inter-Regular',
      android: 'Inter-Regular',
      default: 'Inter-Regular',
    }),
    medium: Platform.select({
      ios: 'Inter-Medium',
      android: 'Inter-Medium',
      default: 'Inter-Medium',
    }),
    semibold: Platform.select({
      ios: 'Inter-SemiBold',
      android: 'Inter-SemiBold',
      default: 'Inter-SemiBold',
    }),
    bold: Platform.select({
      ios: 'Inter-Bold',
      android: 'Inter-Bold',
      default: 'Inter-Bold',
    }),
  },
  
  sizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  
  lineHeights: {
    tight: 1.2,     // For headings
    normal: 1.5,    // For body text
    loose: 1.8,     // For readable content
  },
};

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const borderRadius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

export const fontSizes = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const fontWeights = {
  normal: 'normal',
  thin: 'thin',
  light: 'light',
  medium: 'medium',
  bold: 'bold',
  ultralight: 'ultralight'
};

export const animation = {
  durations: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    // Commonly used easing functions would go here
    // In React Native Reanimated, these come from the library
  },
};