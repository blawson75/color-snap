import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CameraScreen } from '../screens/CameraScreen';
import { SnapshotScreen } from '../screens/SnapshotScreen';
import { LanguagePicker } from '../screens/LanguagePicker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type RootStackParamList = {
  Camera: undefined;
  Snapshot: { imageUri: string; language: string };
  LanguagePicker: { currentLanguage: string; onSelect: (lang: string) => void };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              animation: 'slide_from_right',
              animationTypeForReplacement: 'push',
            }}
            initialRouteName="Camera"
          >
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen
              name="Snapshot"
              component={SnapshotScreen}
              options={{ animation: 'slide_from_right', animationTypeForReplacement: 'pop' }}
            />
            <Stack.Screen
              name="LanguagePicker"
              component={LanguagePicker}
              options={{ animation: 'slide_from_bottom' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};