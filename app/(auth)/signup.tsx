import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/utils/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Text from '@/components/Text';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Mail, Lock, User, Calendar } from 'lucide-react-native';
import { isValidEmail } from '@/utils/helpers';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  
  const { signUp, isLoading } = useAuth();
  
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setAgeError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setSignupError('');
    
    // Validate name
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    }
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    
    // Validate age
    if (!age) {
      setAgeError('Age is required');
      isValid = false;
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        setAgeError('You must be at least 18 years old');
        isValid = false;
      }
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSignup = async () => {
    if (!validateForm()) return;
    
    try {
      await signUp({
        name,
        email,
        age: parseInt(age),
        gender: 'other', // Default, will be updated in profile setup
        lookingFor: 'everyone', // Default, will be updated in profile setup
        interests: [], // Will be updated in profile setup
        photos: ['https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'], // Default placeholder
        bio: '', // Will be updated in profile setup
      });
      // Navigation is handled in the signUp function
    } catch (error) {
      setSignupError('Could not create account. Please try again.');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.neutral[800]} />
          </TouchableOpacity>
          
          <Text variant="heading2" style={styles.title}>
            Create Account
          </Text>
          
          <Text variant="body" color={colors.neutral[600]} style={styles.subtitle}>
            Sign up to start finding meaningful connections
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          {signupError ? (
            <View style={styles.errorContainer}>
              <Text variant="body" color={colors.error[500]}>
                {signupError}
              </Text>
            </View>
          ) : null}
          
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            error={nameError}
            leftIcon={<User size={20} color={colors.neutral[500]} />}
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            leftIcon={<Mail size={20} color={colors.neutral[500]} />}
          />
          
          <Input
            label="Age"
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            error={ageError}
            leftIcon={<Calendar size={20} color={colors.neutral[500]} />}
          />
          
          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.neutral[500]} />}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={confirmPasswordError}
            leftIcon={<Lock size={20} color={colors.neutral[500]} />}
          />
          
          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={isLoading}
            size="large"
            style={styles.signupButton}
          />
          
          <View style={styles.termsContainer}>
            <Text variant="caption" center color={colors.neutral[600]}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxl + spacing.s,
  },
  backButton: {
    marginBottom: spacing.l,
  },
  title: {
    marginBottom: spacing.s,
  },
  subtitle: {
    marginBottom: spacing.m,
  },
  formContainer: {
    padding: spacing.xl,
  },
  errorContainer: {
    backgroundColor: colors.error[50],
    padding: spacing.m,
    borderRadius: 8,
    marginBottom: spacing.m,
  },
  signupButton: {
    marginVertical: spacing.m,
  },
  termsContainer: {
    marginTop: spacing.s,
  },
});