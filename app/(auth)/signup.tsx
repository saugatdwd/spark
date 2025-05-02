import Button from '@/components/Button';
import Field from '@/components/Field';
import Text from '@/components/Text';
import { ErrorResponse } from '@/constants/global.type';
import { useCustomMutations } from '@/hooks/useMutations';
import { signupSchema, SignUpType } from '@/schemas/signup.schama';
import { colors, spacing } from '@/utils/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

export default function SignupScreen() {
  const form = useForm<SignUpType>({
    resolver: zodResolver(signupSchema),
  });
  const { mutate } = useCustomMutations(
    (client, params) => {
      return client.post('/users', params);
    },
    {
      onSuccess: () => {
        router.push('/login');
      },
      onError: (error: ErrorResponse) => {
        console.log(error);
      },
    }
  );

  const handleSignup = form.handleSubmit((data) => {
    console.log(data)
    mutate({
      name: data.full_name,
      ...data,

    });
  });
  
  console.log(form.formState.errors);

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

          <Text
            variant="body"
            color={colors.neutral[600]}
            style={styles.subtitle}
          >
            Sign up to start finding meaningful connections
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Field
            control={form.control}
            formField={{
              name: 'full_name',
              label: 'Full Name',
              placeholder: 'Enter your name',
              input_type: 'text',
              variant: 'box',
            }}
          />

          <Field
            control={form.control}
            formField={{
              name: 'email',
              label: 'Email',
              placeholder: 'Enter your email',
              input_type: 'text',
              variant: 'box',
            }}
          />

          <Field
            control={form.control}
            formField={{
              name: 'dob',
              label: 'Date of Birth',
              placeholder: 'Select date',
              input_type: 'date',
              variant: 'box',
            }}
          />
          <Field
            control={form.control}
            formField={{
              name: 'gender',
              label: 'Gender',
              input_type: 'radio',
              options: [
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ],
            }}
          />

          <Field
            control={form.control}
            formField={{
              name: 'password',
              label: 'Password',
              placeholder: 'Enter your password',
              input_type: 'password',
              variant: 'box',
            }}
          />

          <Field
            control={form.control}
            formField={{
              name: 'confirm_password',
              label: 'Confirm Password',
              placeholder: 'Confirm your password',
              input_type: 'password',
              variant: 'box',
            }}
          />

          <Button
            title="Create Account"
            onPress={handleSignup}
            size="large"
            style={styles.signupButton}
          />

          <View style={styles.termsContainer}>
            <Text variant="caption" center color={colors.neutral[600]}>
              By signing up, you agree to our Terms of Service and Privacy
              Policy
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
    paddingHorizontal: spacing.xl,
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.s,
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
