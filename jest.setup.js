// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo modules
jest.mock('expo-camera', () => ({
  Camera: 'Camera',
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
  CameraType: { back: 'back', front: 'front' },
}));

jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: () => Promise.resolve({ status: 'granted' }),
  createAssetAsync: () => Promise.resolve(),
}));

jest.mock('expo-file-system', () => ({
  readAsStringAsync: () => Promise.resolve(''),
}));

jest.mock('react-native-view-shot', () => ({
  captureRef: () => Promise.resolve('file://test.jpg'),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { imageUri: 'test.jpg', language: 'en' },
  }),
}));

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    PanGestureHandler: View,
    PinchGestureHandler: View,
    State: {},
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ children, ...props }) => null,
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});