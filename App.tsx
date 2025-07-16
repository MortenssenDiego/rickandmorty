/**
 * Rick and Morty App
 * Aplicación de React Native para explorar personajes de Rick and Morty
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useThemeStore } from './src/store/themeStore';
import { theme } from './src/theme';

function App() {
  const colorScheme = useColorScheme();
  // @ts-ignore
  const { isDarkMode, setTheme } = useThemeStore();
  
  // Sincronizar el tema del sistema SOLO al cargar la app
  React.useEffect(() => {
    // Solo sincronizar si no hay un tema guardado (primera carga)
    if (colorScheme === 'dark' && !isDarkMode) {
      setTheme(true);
    } else if (colorScheme === 'light' && !isDarkMode) {
      setTheme(false);
    }
  }, []); // Solo se ejecuta al montar el componente

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <NavigationContainer
      theme={{
        dark: isDarkMode,
        colors: {
          primary: currentTheme.primary,
          background: currentTheme.background,
          card: currentTheme.surface,
          text: currentTheme.text,
          border: currentTheme.border,
          notification: currentTheme.error,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.background}
      />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;
