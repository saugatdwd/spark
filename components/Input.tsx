import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps, ViewStyle } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/utils/theme';
import Text from './Text';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  secureTextEntry,
  value,
  onChangeText,
  placeholder,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const togglePasswordVisibility = () => setHidePassword(!hidePassword);
  
  const getBorderColor = () => {
    if (error) return colors.error[500];
    if (isFocused) return colors.primary[600];
    return colors.neutral[300];
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { borderColor: getBorderColor() }
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && { paddingLeft: 0 },
            (rightIcon || secureTextEntry) && { paddingRight: 0 }
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={hidePassword}
          autoCapitalize="none"
          {...rest}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.iconContainer} 
            onPress={togglePasswordVisibility}
          >
            {hidePassword ? 
              <Eye size={20} color={colors.neutral[500]} /> : 
              <EyeOff size={20} color={colors.neutral[500]} />
            }
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>
      
      {error && (
        <Text variant="caption" color={colors.error[500]} style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.neutral[700],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.m,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.m,
    color: colors.neutral[800],
    paddingVertical: spacing.s + 2,
    paddingHorizontal: spacing.m,
  },
  iconContainer: {
    padding: spacing.s,
  },
  error: {
    marginTop: spacing.xs,
  },
});