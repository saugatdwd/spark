import React from "react";
import { Animated, StyleSheet, View, ViewProps } from "react-native";

interface FormStepProps extends ViewProps {
  children: React.ReactNode;
  isActive: boolean;
  id: string;
}

const FormStep = ({ children, isActive, id, style, ...props }: FormStepProps) => {
  // Create animated value for opacity and translation
  const [animatedValues] = React.useState({
    opacity: new Animated.Value(isActive ? 1 : 0),
    translateX: new Animated.Value(isActive ? 0 : 100),
  });

  React.useEffect(() => {
    // Animate when isActive changes
    Animated.parallel([
      Animated.timing(animatedValues.opacity, {
        toValue: isActive ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues.translateX, {
        toValue: isActive ? 0 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive, animatedValues]);

  // If not active and fully transparent, don't render to improve performance
  if (!isActive && animatedValues.opacity._value === 0) {
    return null;
  }

  return (
    <Animated.View
      testID={id}
      style={[
        styles.container,
        {
          opacity: animatedValues.opacity,
          transform: [{ translateX: animatedValues.translateX }],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
});

export default FormStep;
