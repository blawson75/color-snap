import React from 'react';
import { AppRegistry } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}

AppRegistry.registerComponent('ColorSnap', () => App);