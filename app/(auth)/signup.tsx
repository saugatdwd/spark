import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Field from '@/components/Field';
import FormStep from '@/components/partial/signup/form-step';
import LocationPicker from '@/components/partial/signup/location-picker';
import PreferenceSelector from '@/components/partial/signup/preference-selector';
import { signupSchema, SignUpType } from '@/schemas/signup.schama';
import { useSignupStyles } from '@/styles/signup.styles';
import { colors, fontSizes, spacing } from '@/utils/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { useCustomMutations } from '@/hooks/useMutations';
import { router } from 'expo-router';
import { ErrorResponse } from '@/constants/global.type';

type Preference = 'men' | 'women' | 'everyone';

const SignUp = () => {
  const styles = useSignupStyles;
  const form = useForm<SignUpType>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
    defaultValues: { full_name: '' },
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dob: null as Date | null,
    password: '',
    confirmPassword: '',
    location: '',
    profilePicture: null as any,
    preference: 'everyone' as Preference,
  });

  const stepFields: Record<number, (keyof SignUpType)[]> = {
    0: ['full_name', 'email'],
    1: ['dob'],
    2: ['password', 'confirm_password'],
    3: ['location'],
    4: ['profile_picture'],
    5: ['preference'],
  };

  const goToNextStep = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { mutate, isPending } = useCustomMutations(
    (client, params) => {
      return client.post('/users', params);
    },
    {
      onSuccess: async () => {
        Alert.alert('Sign up successful!', 'Welcome to the dating app!');
        router.push('/(auth)/login');
      },
      onError: (error: ErrorResponse) => {
        console.log(error.response.data.error.message || '');
      },
    }
  );

  const handleSubmit = (data: SignUpType) => {
    mutate({
      name: data?.full_name,
      ...data,
    });
  };

  // Compute progress percentage
  const progress = ((currentStep + 1) / 6) * 100;

  const renderHeader = () => (
    <View style={styles.header}>
      {currentStep > 0 && (
        <TouchableOpacity style={styles.backButton} onPress={goToPreviousStep}>
          <Text style={{ color: colors.primary[500], display: 'flex' }}>
            <ChevronLeft /> Back
          </Text>
        </TouchableOpacity>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.m,
        }}
      >
        <Text style={{ fontSize: fontSizes.xl, fontWeight: 'bold' }}>
          Let's begin to feel that spark
        </Text>
      </View>
    </View>
  );

  const renderProgressBar = () => (
    <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.m }}>
      <View
        style={{
          width: '100%',
          height: 4,
          backgroundColor: colors.neutral[200],
          borderRadius: 2,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: colors.primary[200],
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={{ padding: spacing.xl }}>
      {currentStep < 5 ? (
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary[600],
            borderRadius: 8,
            padding: spacing.m,
            alignItems: 'center',
          }}
          onPress={goToNextStep}
        >
          <Text
            style={{
              color: colors.white,
              fontWeight: 'semibold',
              fontSize: fontSizes.m,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary[500],
            borderRadius: 8,
            padding: spacing.m,
            alignItems: 'center',
          }}
          onPress={form.handleSubmit(handleSubmit)}
        >
          <Text
            style={{
              color: colors.white,
              fontWeight: 'semibold',
              fontSize: fontSizes.m,
            }}
          >
            {isPending ? 'Signing Up...' : ' Complete Sign Up'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Step indicator dots */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: spacing.xl,
          gap: spacing.xs,
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((step) => (
          <View
            key={step}
            style={{
              width: step === currentStep ? 16 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                step === currentStep
                  ? colors.primary[200]
                  : step < currentStep
                  ? colors.secondary[500]
                  : colors.neutral[300],
            }}
          />
        ))}
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderProgressBar()}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, position: 'relative' }}>
          <FormStep isActive={currentStep === 0} id="step-1">
            <View style={styles.formContainer}>
              <Text
                style={{
                  fontSize: fontSizes.xxl,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: spacing.xl,
                }}
              >
                Let's get started
              </Text>

              <Field
                control={form.control}
                formField={{
                  name: 'full_name',
                  input_type: 'text',
                  label: 'Full Name',
                  placeholder: 'Enter your full name',
                }}
              />

              <Field
                control={form.control}
                formField={{
                  name: 'email',
                  input_type: 'text',
                  label: 'Email',
                  placeholder: 'Enter your email',
                }}
              />
            </View>
          </FormStep>

          <FormStep isActive={currentStep === 1} id="step-2">
            <View style={styles.formContainer}>
              <Text
                style={{
                  fontSize: fontSizes.xxl,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: spacing.xl,
                }}
              >
                When's your birthday?
              </Text>

              <Field
                control={form.control}
                formField={{
                  input_type: 'date',
                  name: 'dob',
                  label: 'Date of Birth',
                  placeholder: 'Enter your date of birth',
                }}
              />

              <Text
                style={{
                  color: colors.neutral[500],
                  fontSize: fontSizes.xs,
                  marginTop: spacing.m,
                }}
              >
                You must be at least 18 years old to use this app.
              </Text>
            </View>
          </FormStep>

          <FormStep isActive={currentStep === 2} id="step-3">
            <View style={styles.formContainer}>
              <Text
                style={{
                  fontSize: fontSizes.xxl,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: spacing.xl,
                }}
              >
                Create a password
              </Text>

              <Field
                control={form.control}
                formField={{
                  input_type: 'password',
                  name: 'password',
                  label: 'Password',
                  placeholder: 'Enter your password',
                }}
              />

              <Field
                control={form.control}
                formField={{
                  input_type: 'password',
                  name: 'confirm_password',
                  label: 'Confirm Password',
                  placeholder: 'Confirm your password',
                }}
              />
            </View>
          </FormStep>

          {/* Step 4: Location */}
          <FormStep isActive={currentStep === 3} id="step-4">
            <View style={styles.formContainer}>
              <Text
                style={{
                  fontSize: fontSizes.xxl,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: spacing.xl,
                }}
              >
                Where are you located?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  gap: spacing.s,
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <View style={{ flex: 2 }}>
                  <Field
                    control={form.control}
                    formField={{
                      name: 'location',
                      input_type: 'text',
                      label: 'Location',
                      placeholder: 'Enter your location',
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <LocationPicker setValue={form.setValue} />
                </View>
              </View>

              <Text
                style={{
                  color: colors.neutral[500],
                  fontSize: fontSizes.xs,
                  marginTop: spacing.m,
                }}
              >
                Your location helps us find matches nearby.
              </Text>
            </View>
          </FormStep>

          {/* Step 5: Profile Picture */}
          <FormStep isActive={currentStep === 4} id="step-5">
            <View style={styles.formContainer}>
              <Text
                style={{
                  fontSize: fontSizes.xxl,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: spacing.xl,
                }}
              >
                Add a profile picture
              </Text>

              <View
                style={{
                  alignItems: 'center',
                  marginBottom: spacing.xl,
                }}
              >
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: colors.neutral[100],
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: spacing.m,
                  }}
                >
                  {formData.profilePicture ? (
                    <Image
                      source={{ uri: formData.profilePicture }}
                      style={{ width: 120, height: 120, borderRadius: 60 }}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: fontSizes.xxxl,
                        color: colors.primary[200],
                      }}
                    >
                      📷
                    </Text>
                  )}
                </View>

                <Field
                  control={form.control}
                  formField={{
                    name: 'profile_picture',
                    input_type: 'image',
                  }}
                />

                <Text
                  style={{
                    color: colors.neutral[500],
                    fontSize: fontSizes.s,
                    marginTop: spacing.m,
                    textAlign: 'center',
                  }}
                >
                  Profiles with photos get more matches!
                </Text>
              </View>
            </View>
          </FormStep>

          {/* Step 6: Preferences */}
          <FormStep isActive={currentStep === 5} id="step-6">
            <View style={styles.formContainer}>
              <Text
                style={{
                  fontSize: fontSizes.xxl,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: spacing.xl,
                }}
              >
                Who would you like to meet?
              </Text>

              <PreferenceSelector
                value={form.watch('preference')}
                onChange={(preference) =>
                  form.setValue('preference', preference)
                }
                options={[
                  { value: 'men', label: 'Men' },
                  { value: 'women', label: 'Women' },
                  { value: 'everyone', label: 'Everyone' },
                ]}
              />

              <Text
                style={{
                  fontSize: fontSizes.l,
                  fontWeight: '600',
                  marginTop: spacing.l,
                  marginBottom: spacing.s,
                  textAlign: 'center',
                }}
              >
                Select Gender
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 15,
                }}
              >
                <PreferenceSelector
                  value={form.watch('gender')}
                  onChange={(gender) => form.setValue('gender', gender)}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </View>
            </View>
          </FormStep>
        </View>
      </ScrollView>

      {renderFooter()}
    </SafeAreaView>
  );
};

export default SignUp;
