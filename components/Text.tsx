import React from 'react';
import { Text as RNText, StyleSheet, TextStyle, TextProps as RNTextProps } from 'react-native';
import { colors, typography } from '@/utils/theme';

interface TextProps extends RNTextProps {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'bodyBold' | 'caption' | 'label';
  color?: string;
  center?: boolean;
  style?: TextStyle;
}

export default function Text({
  variant = 'body',
  color,
  center = false,
  style,
  children,
  ...rest
}: TextProps) {
  const getTextStyle = (): TextStyle => {
    let variantStyle: TextStyle = {};
    
    switch(variant) {
      case 'heading1':
        variantStyle = {
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.xxxl,
          lineHeight: typography.sizes.xxxl * typography.lineHeights.tight,
        };
        break;
      case 'heading2':
        variantStyle = {
          fontFamily: typography.fonts.heading,
          fontSize: typography.sizes.xxl,
          lineHeight: typography.sizes.xxl * typography.lineHeights.tight,
        };
        break;
      case 'heading3':
        variantStyle = {
          fontFamily: typography.fonts.bold,
          fontSize: typography.sizes.xl,
          lineHeight: typography.sizes.xl * typography.lineHeights.tight,
        };
        break;
      case 'body':
        variantStyle = {
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.m,
          lineHeight: typography.sizes.m * typography.lineHeights.normal,
        };
        break;
      case 'bodyBold':
        variantStyle = {
          fontFamily: typography.fonts.semibold,
          fontSize: typography.sizes.m,
          lineHeight: typography.sizes.m * typography.lineHeights.normal,
        };
        break;
      case 'caption':
        variantStyle = {
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.s,
          lineHeight: typography.sizes.s * typography.lineHeights.normal,
        };
        break;
      case 'label':
        variantStyle = {
          fontFamily: typography.fonts.medium,
          fontSize: typography.sizes.s,
          lineHeight: typography.sizes.s * typography.lineHeights.normal,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        };
        break;
    }
    
    return {
      color: color || colors.neutral[800],
      textAlign: center ? 'center' : 'left',
      ...variantStyle,
    };
  };
  
  return (
    <RNText
      style={[getTextStyle(), style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}