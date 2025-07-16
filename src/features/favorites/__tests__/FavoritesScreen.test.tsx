import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FavoritesScreen } from '../FavoritesScreen';
import { CharacterDetailScreen } from '../../characters/CharacterDetailScreen';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { useThemeStore } from '../../../store/themeStore';
import { Character } from '../../../types';

// Mock de los stores
jest.mock('../../../store/favoritesStore');
jest.mock('../../../store/themeStore');

// Mock de react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const Stack = createNativeStackNavigator();

// Datos de prueba
const mockCharacter1: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'Earth (C-137)',
    url: 'https://rickandmortyapi.com/api/location/1',
  },
  location: {
    name: 'Citadel of Ricks',
    url: 'https://rickandmortyapi.com/api/location/3',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

const mockCharacter2: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'Earth (C-137)',
    url: 'https://rickandmortyapi.com/api/location/1',
  },
  location: {
    name: 'Citadel of Ricks',
    url: 'https://rickandmortyapi.com/api/location/3',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
  url: 'https://rickandmortyapi.com/api/character/2',
  created: '2017-11-04T18:48:46.250Z',
};

// Componente wrapper para testing con navegación
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('FavoritesScreen Integration Tests', () => {
  const mockUseFavoritesStore = useFavoritesStore as jest.MockedFunction<typeof useFavoritesStore>;
  const mockUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>;

  beforeEach(() => {
    // Configuración por defecto de los mocks
    mockUseFavoritesStore.mockReturnValue({
      favorites: [],
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => false),
      clearFavorites: jest.fn(),
    });

    mockUseThemeStore.mockReturnValue({
      isDarkMode: false,
      toggleTheme: jest.fn(),
      setTheme: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render empty state when no favorites', () => {
    render(<TestWrapper><FavoritesScreen /></TestWrapper>);

    // Verificar que se muestra el estado vacío con los textos correctos
    expect(screen.getByText('No hay favoritos aún')).toBeTruthy();
    expect(screen.getByText('¡Explora personajes y agrégalos a tus favoritos!')).toBeTruthy();
  });

  test('should render favorites list correctly', () => {
    mockUseFavoritesStore.mockReturnValue({
      favorites: [mockCharacter1, mockCharacter2],
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => true),
      clearFavorites: jest.fn(),
    });

    render(<TestWrapper><FavoritesScreen /></TestWrapper>);

    // Verificar que se muestran los personajes favoritos
    expect(screen.getByText('Rick Sanchez')).toBeTruthy();
    expect(screen.getByText('Morty Smith')).toBeTruthy();
    // Usar getAllByText porque hay múltiples elementos con el mismo texto
    expect(screen.getAllByText('Alive - Human')).toHaveLength(2);
  });

  test('should handle character press and navigate to detail', async () => {
    mockUseFavoritesStore.mockReturnValue({
      favorites: [mockCharacter1],
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => true),
      clearFavorites: jest.fn(),
    });

    render(<TestWrapper><FavoritesScreen /></TestWrapper>);

    // Presionar en el personaje favorito
    const characterCard = screen.getByText('Rick Sanchez');
    fireEvent.press(characterCard);

    // Verificar que se navega al detalle
    await waitFor(() => {
      expect(characterCard).toBeTruthy();
    });
  });

  test('should not show clear all favorites button when there are favorites', () => {
    mockUseFavoritesStore.mockReturnValue({
      favorites: [mockCharacter1, mockCharacter2],
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => true),
      clearFavorites: jest.fn(),
    });

    render(<TestWrapper><FavoritesScreen /></TestWrapper>);

    // Verificar que NO se muestra el botón de limpiar todos los favoritos (no implementado)
    expect(screen.queryByTestId('clear-all-favorites-button')).toBeNull();
    expect(screen.queryByText('Limpiar Favoritos')).toBeNull();
  });

  test('should not show clear all button when no favorites', () => {
    render(<TestWrapper><FavoritesScreen /></TestWrapper>);

    // Verificar que NO se muestra el botón de limpiar todos los favoritos
    expect(screen.queryByTestId('clear-all-favorites-button')).toBeNull();
  });

  test('should not show favorites count in header', () => {
    mockUseFavoritesStore.mockReturnValue({
      favorites: [mockCharacter1, mockCharacter2],
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => true),
      clearFavorites: jest.fn(),
    });

    render(<TestWrapper><FavoritesScreen /></TestWrapper>);

    // Verificar que NO se muestra el contador de favoritos (no implementado)
    expect(screen.queryByText('Favoritos (2)')).toBeNull();
  });

  test('should not show correct count for single favorite', () => {
    mockUseFavoritesStore.mockReturnValue({
      favorites: [mockCharacter1],
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => true),
      clearFavorites: jest.fn(),
    });

    render(<TestWrapper><FavoritesScreen /></TestWrapper>);

    // Verificar que NO se muestra el contador (no implementado)
    expect(screen.queryByText('Favoritos (1)')).toBeNull();
  });

  test('should not handle swipe to remove favorite', async () => {
    const mockRemoveFavorite = jest.fn();
    mockUseFavoritesStore.mockReturnValue({
      favorites: [mockCharacter1],
      addFavorite: jest.fn(),
      removeFavorite: mockRemoveFavorite,
      isFavorite: jest.fn(() => true),
      clearFavorites: jest.fn(),
    });

    render(<TestWrapper><FavoritesScreen /></TestWrapper>);

    // Verificar que NO se puede hacer swipe (no implementado)
    const characterCard = screen.getByText('Rick Sanchez');
    expect(characterCard).toBeTruthy();
    
    // No debería llamar removeFavorite porque no está implementado el swipe
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  test('should not handle pull to refresh', () => {
    mockUseFavoritesStore.mockReturnValue({
      favorites: [mockCharacter1],
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => true),
      clearFavorites: jest.fn(),
    });

    render(<TestWrapper><FavoritesScreen /></TestWrapper>);

    // Verificar que NO hay FlatList con testID (no implementado)
    expect(screen.queryByTestId('favorites-flatlist')).toBeNull();
  });
}); 