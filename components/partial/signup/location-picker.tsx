import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';

interface LocationPickerProps {
  setValue: (name: string, value: string) => void;
}

const LocationPicker = ({ setValue }: LocationPickerProps) => {
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = async () => {
    setIsDetecting(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        setIsDetecting(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=3c3c74766ff745018eac6d6c8d4e43ff`
      );
      const data = await response.json();
      const location = data?.results?.[0]?.formatted || 'Ram location';
      setValue('location', location);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to detect your location.');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <View style={styles.container}>
      {isDetecting ? (
        <ActivityIndicator size="small" />
      ) : (
        <Button title="Detect Location" onPress={detectLocation} />
      )}
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
