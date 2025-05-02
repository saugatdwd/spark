import Button from '@/components/Button';
import Input from '@/components/Input';
import Text from '@/components/Text';
import { ErrorResponse } from '@/constants/global.type';
import { useAuth } from '@/context/AuthContext';
import { useCustomMutations } from '@/hooks/useMutations';
import { isValidEmail } from '@/utils/helpers';
import { colors, spacing } from '@/utils/theme';
import { Link, router } from 'expo-router';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const { signIn, isLoading } = useAuth();
  
  const {mutate} = useCustomMutations((client, params) => {
    return client.post('auth/login', params);
  }, {
    onSuccess: () => {
      
      router.push('/settings')
    },
    onError: (error : ErrorResponse) => {
        setLoginError(error?.response?.data?.error.message)
    }
  }) 


  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setLoginError('');
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleLogin = async () => {
    console.log("herreee")
    if (!validateForm()) return;
    try {
      mutate({
        email: email,
        password: password
      })
      // Navigation handled in the signIn function
    } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
    }
  };
  
  // Demo login (for testing)
  const handleDemoLogin = async () => {
    try {
      await signIn('jessica@example.com', 'password123');
      router.push('/(tabs)')
    } catch (error) {
      setLoginError('Could not log in with demo account');
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
            Welcome back
          </Text>
          
          <Text variant="body" color={colors.neutral[600]} style={styles.subtitle}>
            Sign in to continue using Spark
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          {loginError ? (
            <View style={styles.errorContainer}>
              <Text variant="body" color={colors.error[500]}>
                {loginError}
              </Text>
            </View>
          ) : null}
          
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
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.neutral[500]} />}
          />
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text variant="body" color={colors.primary[600]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          <Button
            title="Log In"
            onPress={handleLogin}
            loading={isLoading}
            size="large"
            style={styles.loginButton}
          />
          
          <Button
            title="Try Demo Account"
            onPress={handleDemoLogin}
            variant="outline"
            style={styles.demoButton}
          />
          
          <View style={styles.signupContainer}>
            <Text variant="body" color={colors.neutral[600]}>
              Don't have an account?
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text variant="bodyBold" color={colors.primary[600]}>
                  {' Sign Up'}
                </Text>
              </TouchableOpacity>
            </Link>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginBottom: spacing.m,
  },
  demoButton: {
    marginBottom: spacing.xl,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});