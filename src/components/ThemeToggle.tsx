import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '../store/themeStore';
import { theme } from '../theme';

interface ThemeToggleProps {
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 24 }) => {
  // @ts-ignore
  const { isDarkMode, toggleTheme } = useThemeStore();
  const colors = theme[isDarkMode ? 'dark' : 'light'];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.primary }]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons 
        name={isDarkMode ? 'weather-sunny' : 'weather-night'} 
        size={size} 
        color={colors.background} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 