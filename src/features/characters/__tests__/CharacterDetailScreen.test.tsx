import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CharacterDetailScreen } from '../CharacterDetailScreen';
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
const mockCharacter: Character = {
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

// Componente wrapper para testing con navegación
const TestWrapper = ({ character }: { character: Character }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
        name="CharacterDetail" 
        component={CharacterDetailScreen}
        initialParams={{ character }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('CharacterDetailScreen', () => {
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
      setNotificationCallbacks: jest.fn(),
      onAddFavorite: undefined,
      onRemoveFavorite: undefined,
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

  it('should render character details correctly', () => {
    render(<TestWrapper character={mockCharacter} />);

    expect(screen.getByText('Rick Sanchez')).toBeOnTheScreen();
    expect(screen.getByText('Vivo')).toBeOnTheScreen(); // Estado traducido
    expect(screen.getByText('Human')).toBeOnTheScreen();
    expect(screen.getByText('Masculino')).toBeOnTheScreen(); // Género traducido
    expect(screen.getByText('Earth (C-137)')).toBeOnTheScreen();
    expect(screen.getByText('Citadel of Ricks')).toBeOnTheScreen();
  });

  it('should show favorite button when character is not in favorites', () => {
    mockUseFavoritesStore.mockReturnValue({
      favorites: [],
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => false),
      clearFavorites: jest.fn(),
      setNotificationCallbacks: jest.fn(),
      onAddFavorite: undefined,
      onRemoveFavorite: undefined,
    });

    render(<TestWrapper character={mockCharacter} />);

    // Verificar que el botón de favorito está presente con testID
    expect(screen.getByTestId('favorite-button')).toBeOnTheScreen();
  });

  it('should show favorite button when character is in favorites', () => {
    mockUseFavoritesStore.mockReturnValue({
      favorites: [mockCharacter],
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => true),
      clearFavorites: jest.fn(),
      setNotificationCallbacks: jest.fn(),
      onAddFavorite: undefined,
      onRemoveFavorite: undefined,
    });

    render(<TestWrapper character={mockCharacter} />);

    // Verificar que el botón de favorito está presente con testID
    expect(screen.getByTestId('favorite-button')).toBeOnTheScreen();
  });

  it('should call addFavorite when favorite button is pressed', async () => {
    const mockAddFavorite = jest.fn();
    mockUseFavoritesStore.mockReturnValue({
      favorites: [],
      addFavorite: mockAddFavorite,
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => false),
      clearFavorites: jest.fn(),
      setNotificationCallbacks: jest.fn(),
      onAddFavorite: undefined,
      onRemoveFavorite: undefined,
    });

    const user = userEvent.setup();
    render(<TestWrapper character={mockCharacter} />);

    // Presionar el botón de favoritos usando testID
    const favoriteButton = screen.getByTestId('favorite-button');
    await user.press(favoriteButton);

    // Verificar que se llamó la función addFavorite
    expect(mockAddFavorite).toHaveBeenCalledWith(mockCharacter);
  });

  it('should call removeFavorite when favorite button is pressed and character is already favorite', async () => {
    const mockRemoveFavorite = jest.fn();
    mockUseFavoritesStore.mockReturnValue({
      favorites: [mockCharacter],
      addFavorite: jest.fn(),
      removeFavorite: mockRemoveFavorite,
      isFavorite: jest.fn(() => true),
      clearFavorites: jest.fn(),
      setNotificationCallbacks: jest.fn(),
      onAddFavorite: undefined,
      onRemoveFavorite: undefined,
    });

    const user = userEvent.setup();
    render(<TestWrapper character={mockCharacter} />);

    // Presionar el botón de favoritos usando testID
    const favoriteButton = screen.getByTestId('favorite-button');
    await user.press(favoriteButton);

    // Verificar que se llamó la función removeFavorite
    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockCharacter.id);
  });

  it('should show episode count correctly', () => {
    render(<TestWrapper character={mockCharacter} />);

    expect(screen.getByText('2')).toBeOnTheScreen();
  });

  it('should handle character with no episodes', () => {
    const characterWithNoEpisodes = {
      ...mockCharacter,
      episode: [],
    };

    render(<TestWrapper character={characterWithNoEpisodes} />);

    expect(screen.getByText('0')).toBeOnTheScreen();
  });

  it('should handle character with unknown status', () => {
    const characterWithUnknownStatus = {
      ...mockCharacter,
      status: 'unknown' as const,
    };

    render(<TestWrapper character={characterWithUnknownStatus} />);

    // Verificar que hay al menos un elemento con "Desconocido" (puede ser estado o género)
    expect(screen.getAllByText('Desconocido').length).toBeGreaterThan(0);
  });

  it('should handle character with no type', () => {
    const characterWithNoType = {
      ...mockCharacter,
      type: '',
    };

    render(<TestWrapper character={characterWithNoType} />);

    expect(screen.getByText('Rick Sanchez')).toBeOnTheScreen();
    expect(screen.getByText('Desconocido')).toBeOnTheScreen();
  });

  it('should handle character with type', () => {
    const characterWithType = {
      ...mockCharacter,
      type: 'Test Type',
    };

    render(<TestWrapper character={characterWithType} />);

    expect(screen.getByText('Test Type')).toBeOnTheScreen();
  });

  it('should handle character with unknown gender', () => {
    const characterWithUnknownGender = {
      ...mockCharacter,
      gender: 'unknown' as const,
    };

    render(<TestWrapper character={characterWithUnknownGender} />);

    // Verificar que hay al menos un elemento con "Desconocido" (puede ser estado o género)
    expect(screen.getAllByText('Desconocido').length).toBeGreaterThan(0);
  });

  it('should handle character with genderless gender', () => {
    const characterWithGenderless = {
      ...mockCharacter,
      gender: 'Genderless' as const,
    };

    render(<TestWrapper character={characterWithGenderless} />);

    expect(screen.getByText('Sin género')).toBeOnTheScreen(); // Género traducido
  });

  it('should handle character with dead status', () => {
    const characterWithDeadStatus = {
      ...mockCharacter,
      status: 'Dead' as const,
    };

    render(<TestWrapper character={characterWithDeadStatus} />);

    expect(screen.getByText('Muerto')).toBeOnTheScreen(); // Estado traducido
  });
}); 