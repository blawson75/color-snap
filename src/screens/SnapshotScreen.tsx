import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  View, 
  Image, 
  Text,
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { languages, LanguageCode } from '../utils/colorNames';
import { getColorName } from '../services/colorService';
import { CircleOverlay } from '../components/CircleOverlay';
import { ColorLabel } from '../components/ColorLabel';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type RootStackParamList = {
  Camera: undefined;
  Snapshot: { imageUri: string; language: LanguageCode };
  LanguagePicker: { currentLanguage: LanguageCode; onSelect: (lang: LanguageCode) => void };
};

type SnapshotRouteProp = RouteProp<RootStackParamList, 'Snapshot'>;
type SnapshotNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Snapshot'>;

interface RouteParams {
  imageUri: string;
  language: LanguageCode;
}

export const SnapshotScreen: React.FC = () => {
  const navigation = useNavigation<SnapshotNavigationProp>();
  const route = useRoute<SnapshotRouteProp>();
  const { imageUri, language: initialLanguage } = route.params;

  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [sampledColor, setSampledColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [samplePoint, setSamplePoint] = useState<{ x: number; y: number } | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Transform values for zoom/pan
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const imageDims = useSharedValue({ width: 0, height: 0 });

  // ViewShot ref for saving
  const viewShotRef = useRef<React.Component<any, any>>(null);

  // Calculate max translate bounds to keep image visible
  const getMaxTranslate = () => {
    'worklet';
    const dims = imageDims.value;
    if (!dims.width || !dims.height) return { maxX: 0, maxY: 0 };
    
    const scaledWidth = dims.width * scale.value;
    const scaledHeight = dims.height * scale.value;
    
    const maxX = Math.max(0, (scaledWidth - SCREEN_WIDTH) / 2);
    const maxY = Math.max(0, (scaledHeight - SCREEN_HEIGHT) / 2);
    
    return { maxX, maxY };
  };

  // Handle image load to get dimensions
  const onImageLoad = (event: any) => {
    const dims = {
      width: event.nativeEvent.source.width,
      height: event.nativeEvent.source.height,
    };
    setImageDimensions(dims);
    imageDims.value = dims;
  };

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      'worklet';
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onUpdate((event) => {
      'worklet';
      scale.value = Math.max(1, Math.min(5, scale.value * event.scale));
    })
    .onEnd(() => {
      'worklet';
      const { maxX, maxY } = getMaxTranslate();
      translateX.value = withTiming(
        Math.max(-maxX, Math.min(maxX, translateX.value)),
        { duration: 200, easing: Easing.out(Easing.cubic) }
      );
      translateY.value = withTiming(
        Math.max(-maxY, Math.min(maxY, translateY.value)),
        { duration: 200, easing: Easing.out(Easing.cubic) }
      );
    });

  // Pan gesture
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      const { maxX, maxY } = getMaxTranslate();
      translateX.value = Math.max(-maxX, Math.min(maxX, event.translationX));
      translateY.value = Math.max(-maxY, Math.min(maxY, event.translationY));
    })
    .onEnd(() => {
      'worklet';
      const { maxX, maxY } = getMaxTranslate();
      translateX.value = withTiming(
        Math.max(-maxX, Math.min(maxX, translateX.value)),
        { duration: 200, easing: Easing.out(Easing.cubic) }
      );
      translateY.value = withTiming(
        Math.max(-maxY, Math.min(maxY, translateY.value)),
        { duration: 200, easing: Easing.out(Easing.cubic) }
      );
    });

  // Tap gesture
  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      if (!imageDimensions) return;
      
      // Get touch position relative to screen
      const touchX = event.x;
      const touchY = event.y;

      // Convert to image coordinates
      const { maxX, maxY } = getMaxTranslate();
      
      // The image center is at screen center + translate
      const imageCenterX = SCREEN_WIDTH / 2 + translateX.value;
      const imageCenterY = SCREEN_HEIGHT / 2 + translateY.value;
      
      // Position on the scaled image
      const scaledWidth = imageDimensions.width * scale.value;
      const scaledHeight = imageDimensions.height * scale.value;
      
      // Convert touch to image-relative coordinates
      const imageRelativeX = (touchX - imageCenterX + scaledWidth / 2) / scale.value;
      const imageRelativeY = (touchY - imageCenterY + scaledHeight / 2) / scale.value;

      // Check if touch is within image bounds
      if (
        imageRelativeX >= 0 && imageRelativeX <= imageDimensions.width &&
        imageRelativeY >= 0 && imageRelativeY <= imageDimensions.height
      ) {
        sampleColorFromImage(imageUri, imageRelativeX, imageRelativeY, imageDimensions.width, imageDimensions.height);
        setSamplePoint({ x: touchX, y: touchY });
      }
    });

  // Combined gesture
  const gesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    tapGesture
  );

  // Sample color from image at tap coordinates
  // Note: Real pixel reading in Expo Go requires native modules (not available without build)
  // This simulates based on coordinates; for production, use react-native-image-colors with a dev build
  const sampleColorFromImage = async (
    uri: string,
    x: number,
    y: number,
    imgWidth: number,
    imgHeight: number
  ) => {
    try {
      // For now, use coordinate-based simulation
      // Real implementation would use: react-native-image-colors or native pixel reading
      const hue = Math.floor((x / imgWidth) * 360);
      const saturation = Math.floor((y / imgHeight) * 100);
      const lightness = 50;

      const hslToRgb = (h: number, s: number, l: number) => {
        s /= 100; l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return {
          r: Math.round(f(0) * 255),
          g: Math.round(f(8) * 255),
          b: Math.round(f(4) * 255),
        };
      };

      const color = hslToRgb(hue, saturation, lightness);
      setSampledColor(color);
    } catch (error) {
      console.error('Error sampling color:', error);
      setSampledColor({ r: 128, g: 128, b: 128 });
    }
  };

  // Save the annotated image
  const handleSave = async () => {
    if (!viewShotRef.current) return;
    
    setIsSaving(true);
    try {
      const uri = await captureRef(viewShotRef.current, {
        format: 'jpg',
        quality: 0.9,
        result: 'tmpfile',
        snapshotContentContainer: false,
      });

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access to save images.');
        setIsSaving(false);
        return;
      }

      await MediaLibrary.createAssetAsync(uri);
      runOnJS(() => {
        Alert.alert('Saved!', 'Image saved to your photo library.');
        setIsSaving(false);
      })();
    } catch (error) {
      console.error('Save error:', error);
      runOnJS(() => {
        Alert.alert('Error', 'Failed to save image. Please try again.');
        setIsSaving(false);
      })();
    }
  };

  // Reset zoom/pan
  const handleReset = () => {
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    translateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
  };

  // Close and go back to camera
  const handleClose = () => {
    navigation.goBack();
  };

  // Animated style for the image
  const animatedImageStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  // Calculate image display size to fit screen while maintaining aspect ratio
  const getImageStyle = () => {
    if (!imageDimensions) return { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };
    
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    let displayWidth = SCREEN_WIDTH;
    let displayHeight = SCREEN_WIDTH / aspectRatio;
    
    if (displayHeight > SCREEN_HEIGHT) {
      displayHeight = SCREEN_HEIGHT;
      displayWidth = SCREEN_HEIGHT * aspectRatio;
    }
    
    return { width: displayWidth, height: displayHeight };
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.imageContainer, getImageStyle()]}>
          <Animated.Image
            ref={viewShotRef}
            source={{ uri: imageUri }}
            style={[styles.image, animatedImageStyle]}
            onLoad={onImageLoad}
            resizeMode="contain"
          />
          <CircleOverlay point={samplePoint} />
          <ColorLabel colorRgb={sampledColor} language={language} />
        </Animated.View>
      </GestureDetector>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Color Sample</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleReset}>
          <Ionicons name="refresh" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.actionButton, isSaving && styles.buttonDisabled]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name={isSaving ? 'save' : 'save'} size={24} color="#fff" />
          <Text style={styles.actionButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('LanguagePicker', { currentLanguage: language, onSelect: setLanguage })}>
          <Ionicons name="globe" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    zIndex: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    zIndex: 10,
  },
  iconButton: {
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});