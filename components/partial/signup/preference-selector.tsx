import { colors, fontSizes, spacing } from '@/utils/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PreferenceSelectorProps {
  onChange: (preference: string) => void;
  value: string;
  options: { value: string; label: string }[];
}

const PreferenceSelector = ({
  onChange,
  value,
  options,
}: PreferenceSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>I am interested in:</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              value === option.value && styles.selectedOption,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                value === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: spacing.m,
  },
  label: {
    fontSize: fontSizes.s,
    fontWeight: 'medium',
    marginBottom: spacing.m,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  optionText: {
    color: colors.secondary[500],
    fontWeight: 'medium',
  },
  selectedOptionText: {
    color: colors.white,
  },
});

export default PreferenceSelector;
