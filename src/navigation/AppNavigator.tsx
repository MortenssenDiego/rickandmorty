import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CharactersScreen } from '../features/characters/CharactersScreen';
import { CharacterDetailScreen } from '../features/characters/CharacterDetailScreen';
import { FavoritesScreen } from '../features/favorites/FavoritesScreen';
import { ThemeToggle } from '../components/ThemeToggle';
import { NavigationParamList } from '../types';

// Stack navigator para manejar la navegación entre pantallas principales y detalles
const Stack = createNativeStackNavigator<NavigationParamList>();

// Tab navigator para la navegación inferior entre secciones principales
const Tab = createBottomTabNavigator();

// Stack de personajes - NO SE UTILIZA ACTUALMENTE pero existe para posible uso futuro
// Permite navegación interna dentro del tab de personajes (ej: lista -> detalle -> episodios)
const CharactersStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Characters" 
      component={CharactersScreen} 
      options={{ title: 'Personajes' }} 
    />
    <Stack.Screen 
      name="CharacterDetail" 
      component={CharacterDetailScreen} 
      options={{ title: 'Detalle del Personaje' }} 
    />
  </Stack.Navigator>
);

// Stack de favoritos - NO SE UTILIZA ACTUALMENTE pero existe para posible uso futuro
// Permite navegación interna dentro del tab de favoritos (ej: lista -> detalle -> estadísticas)
const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Favorites" 
      component={FavoritesScreen} 
      options={{ title: 'Favoritos' }} 
    />
    <Stack.Screen 
      name="CharacterDetail" 
      component={CharacterDetailScreen} 
      options={{ title: 'Detalle del Personaje' }} 
    />
  </Stack.Navigator>
);

// Navegador principal con tabs inferiores
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      // Configuración global para todos los tabs
      tabBarActiveTintColor: '#00FF41', // Color verde del portal de Rick & Morty
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#1a1a1a', // Fondo oscuro para el tab bar
        borderTopColor: '#333',
      },
      headerStyle: {
        backgroundColor: '#1a1a1a',
      },
      headerTintColor: '#00FF41',
    }}
  >
    {/* Tab de Personajes - Pantalla principal con lista de personajes */}
    <Tab.Screen
      name="Characters"
      component={CharactersScreen}
      options={{
        title: 'Personajes',
        // Ícono de grupo de personas para representar la lista de personajes
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account-group" color={color} size={size} />
        ),
        // Agregar el ThemeToggle al header
        headerRight: () => <ThemeToggle size={24} />,
        // Agregar accessibilityLabel para testing
        tabBarAccessibilityLabel: 'Characters, tab, 1 of 2',
      }}
    />
    
    {/* Tab de Favoritos - Pantalla con personajes marcados como favoritos */}
    <Tab.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{
        title: 'Favoritos',
        // Ícono de corazón para representar los favoritos
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons 
            name="heart" 
            color={color} 
            size={size}
            testID="tab-favorites-icon"
          />
        ),
        // Agregar el ThemeToggle al header
        headerRight: () => <ThemeToggle size={24} />,
        // Agregar accessibilityLabel para testing
        tabBarAccessibilityLabel: 'Favorites, tab, 2 of 2',

      }}
    />
  </Tab.Navigator>
);

// Navegador principal de la aplicación
export const AppNavigator = () => (
  <Stack.Navigator>
    {/* Pantalla principal con tabs */}
    <Stack.Screen 
      name="MainTabs" 
      component={TabNavigator} 
      options={{ headerShown: false }} // Ocultamos el header porque los tabs tienen su propio header
    />
    
    {/* Pantalla de detalle del personaje - accesible desde cualquier tab */}
    <Stack.Screen 
      name="CharacterDetail" 
      component={CharacterDetailScreen} 
      options={{ 
        title: 'Detalle del Personaje',
        // Configuración del header para la pantalla de detalle
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#00FF41',
        // Agregar el ThemeToggle al header
        headerRight: () => <ThemeToggle size={24} />,
      }} 
    />
  </Stack.Navigator>
); 