import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ImagePickerFieldProps {
  value: string | null;
  onChange: (uri: string | null) => void;
  disabled?: boolean;
}

const ImagePickerField = ({ value, onChange, disabled }: ImagePickerFieldProps) => {
  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera roll permission is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePickImage}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>
          {value ? "Change Photo" : "Upload Photo"}
        </Text>
      </TouchableOpacity>

      {value && (
        <Image source={{ uri: value }} style={styles.image} resizeMode="cover" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#5D5FEF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#5D5FEF",
    fontWeight: "500",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default ImagePickerField;
