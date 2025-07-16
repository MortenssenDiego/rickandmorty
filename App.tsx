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
import { useAppInitialization } from './src/hooks/useAppInitialization';
import { InitialLoader } from './src/components/InitialLoader';
import { theme } from './src/theme';

function App() {
  const colorScheme = useColorScheme();
  const { isInitialized, isLoading } = useAppInitialization();
  // @ts-ignore
  const { isDarkMode, setTheme } = useThemeStore();
  
  // Sincronizar el tema del sistema solo en la primera carga
  React.useEffect(() => {
    // Verificar si es la primera carga (cuando isDarkMode es false por defecto)
    // y no hay tema guardado en AsyncStorage
    const syncThemeWithSystem = async () => {
      try {
        // Solo sincronizar si el tema del sistema es diferente al actual
        // y parece ser la primera carga (isDarkMode es false)
        if (colorScheme === 'dark' && !isDarkMode) {
          setTheme(true);
        } else if (colorScheme === 'light' && isDarkMode) {
          setTheme(false);
        }
      } catch (error) {
        console.log('Error al sincronizar tema:', error);
      }
    };

    syncThemeWithSystem();
  }, [colorScheme]); // Depender del colorScheme para reaccionar a cambios del sistema

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  // Mostrar loader mientras se inicializa la app
  if (!isInitialized || isLoading) {
    return (
      <InitialLoader message="Inicializando aplicación..." />
    );
  }

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
