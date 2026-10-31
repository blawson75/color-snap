import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface CircleOverlayProps {
  point: { x: number; y: number } | null;
  size?: number;
}

export const CircleOverlay: React.FC<CircleOverlayProps> = ({ point, size = 80 }) => {
  const animatedScale = useSharedValue(0);

  React.useEffect(() => {
    if (point) {
      animatedScale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) });
    } else {
      animatedScale.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.cubic) });
    }
  }, [point]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = animatedScale.value;
    return {
      transform: [
        { translateX: point ? point.x - size / 2 : 0 },
        { translateY: point ? point.y - size / 2 : 0 },
        { scale },
      ],
      opacity: scale,
    };
  }, [point]);

  if (!point) return null;

  return (
    <Animated.View style={[styles.circle, animatedStyle]} />
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
    position: 'absolute',
    pointerEvents: 'none',
  },
});