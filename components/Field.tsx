import React from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Control, Controller, FieldValues, FieldPath } from 'react-hook-form';
import Checkbox from '@react-native-community/checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { colors, fontSizes, spacing } from '@/utils/theme';
import ImagePickerField from './ImagePickerField';

export interface FormFieldModel<Name extends string | symbol = string> {
  name: Name;
  label?: string;
  placeholder?: string;
  input_type?:
    | 'text'
    | 'password'
    | 'checkbox'
    | 'switch'
    | 'date'
    | 'radio'
    | 'image';
  variant?: 'box' | 'underline';
  options?: { label: string; value: string | number }[];
  required?: boolean;
  description?: string;
  hidden?: boolean;
}

interface FieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  disabled?: boolean;
  formField: FormFieldModel<FieldPath<TFieldValues>>;
}

export function Field<TFieldValues extends FieldValues = FieldValues>({
  control,
  disabled,
  formField,
}: FieldProps<TFieldValues>) {
  const {
    name,
    label,
    placeholder,
    input_type = 'text',
    variant = 'box',
    options = [],
  } = formField;

  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  return (
    <View style={[styles.container, formField.hidden && { display: 'none' }]}>
      {label && (
        <Text style={styles.label}>
          {label}{' '}
          {formField.required && <Text style={{ color: 'red' }}>*</Text>}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          switch (input_type) {
            case 'switch':
              return (
                <View style={styles.booleanContainer}>
                  <Switch
                    value={!!value}
                    onValueChange={onChange}
                    disabled={disabled}
                  />
                </View>
              );

            case 'checkbox':
              return (
                <View style={styles.booleanContainer}>
                  <Checkbox
                    value={!!value}
                    onValueChange={onChange}
                    disabled={disabled}
                  />
                </View>
              );

            case 'date':
              return (
                <>
                  <TouchableOpacity
                    onPress={showDatePicker}
                    disabled={disabled}
                    style={[styles.dateInput, error && styles.errorInput]}
                  >
                    <Text style={{ color: value ? '#000' : '#999' }}>
                      {value
                        ? moment(value).format('YYYY-MM-DD')
                        : placeholder || 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={value ? new Date(value) : new Date()}
                    onConfirm={(date) => {
                      onChange(date);
                      hideDatePicker();
                    }}
                    onCancel={hideDatePicker}
                  />
                  {error && (
                    <Text style={styles.errorText}>
                      {error.message || 'This field is required'}
                    </Text>
                  )}
                </>
              );

            case 'radio':
              return (
                <>
                  <View style={styles.radioGroup}>
                    {options.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={styles.radioOption}
                        onPress={() => onChange(option.value)}
                        disabled={disabled}
                      >
                        <View style={styles.radioOuter}>
                          {value === option.value && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {error && (
                    <Text style={styles.errorText}>
                      {error.message || 'This field is required'}
                    </Text>
                  )}
                </>
              );
            case 'image':
              return (
                <>
                  <ImagePickerField
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                  />
                  {error && (
                    <Text style={styles.errorText}>
                      {error.message || 'This field is required'}
                    </Text>
                  )}
                </>
              );

            default:
              return (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      variant === 'underline' && styles.underline,
                      error && styles.errorInput,
                    ]}
                    placeholder={placeholder}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={input_type === 'password'}
                    editable={!disabled}
                  />
                  {error && (
                    <Text style={styles.errorText}>
                      {error.message || 'This field is required'}
                    </Text>
                  )}
                </>
              );
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: fontSizes.m,
    fontWeight: 'medium',
    marginBottom: spacing.s,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 8,
    padding: spacing.m,
    fontSize: fontSizes.m,
    color: colors.neutral[800],
    fontWeight: 'medium',
    marginBottom: spacing.s,
  },
  underline: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 0,
  },
  booleanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', marginTop: 4 },
  dateInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: colors.primary[100],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[300],
  },
  radioLabel: {
    fontSize: 16,
  },
});

export default Field;
