import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { languages, LanguageCode } from '../utils/colorNames';

type RootStackParamList = {
  Camera: undefined;
  Snapshot: { imageUri: string; language: LanguageCode };
  LanguagePicker: { currentLanguage: LanguageCode; onSelect: (lang: LanguageCode) => void };
};

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

export const CameraScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>('back');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const cameraRef = useRef<CameraView>(null);
  const [isSnapshotMode, setIsSnapshotMode] = useState(false);
  const navigation = useNavigation<CameraScreenNavigationProp>();

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera" size={64} color="#666" />
          <Text style={styles.permissionText}>Camera permission is required to use Color Snap.</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takeSnapshot = async () => {
    console.log('takeSnapshot called');
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
          skipProcessing: true,
        });
        console.log('Photo taken:', photo);
        if (photo?.uri) {
          console.log('Navigating to Snapshot with:', photo.uri);
          navigation.navigate('Snapshot', { imageUri: photo.uri, language });
        } else {
          console.error('No photo URI returned');
        }
      } catch (error) {
        console.error('Snapshot error:', error);
        Alert.alert('Error', 'Failed to take snapshot. Please try again.');
      }
    } else {
      console.error('Camera ref is null');
    }
  };

  const flipCamera = () => {
    setType(prev => prev === 'back' ? 'front' : 'back');
  };

  const openLanguagePicker = () => {
    navigation.navigate('LanguagePicker', { currentLanguage: language, onSelect: setLanguage });
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={type}
        ratio="4:3"
      />
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={openLanguagePicker}>
            <Ionicons name="globe" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.languageText}>{languages[language]}</Text>
          </View>
          <View style={styles.iconButton} pointerEvents="none" />
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.iconButton} onPress={flipCamera}>
            <Ionicons name="camera-reverse" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shutterButton}
            onPress={takeSnapshot}
            activeOpacity={0.7}
          >
            <View style={styles.shutterRing}>
              <View style={styles.shutterInner} />
            </View>
          </TouchableOpacity>
          <View style={styles.iconButton} pointerEvents="none" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  languageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  shutterButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shutterRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});