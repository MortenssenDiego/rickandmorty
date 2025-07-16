import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { theme } from '../theme';

interface InitialLoaderProps {
  message?: string;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ 
  message = 'Cargando...' 
}) => {
  // @ts-ignore
  const { isDarkMode } = useThemeStore();
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ActivityIndicator 
        size="large" 
        color={currentTheme.primary}
        style={styles.spinner}
      />
      <Text style={[styles.text, { color: currentTheme.text }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 