import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: React.ReactNode;
  screenName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary ${this.props.screenName}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.header}>ERROR in {this.props.screenName}</Text>
          <Text style={styles.message} numberOfLines={4}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          <View style={styles.button} onStartShouldSetResponder={() => true}>
            <Text
              style={styles.buttonText}
              onLayout={() => {}}
              onPressIn={() => {
                this.setState({ hasError: false, error: null });
              }}
            >
              DISMISS
            </Text>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    color: '#ff5555',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'monospace',
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
