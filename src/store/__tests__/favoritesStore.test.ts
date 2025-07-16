import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useFavoritesStore } from '../favoritesStore';
import { Character } from '../../types';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

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

describe('FavoritesStore', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    const { result } = renderHook(() => useFavoritesStore());
    act(() => {
      result.current.clearFavorites();
    });
  });

  test('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavoritesStore());
    
    expect(result.current.favorites).toEqual([]);
  });

  test('should add a character to favorites', () => {
    const { result } = renderHook(() => useFavoritesStore());
    
    act(() => {
      result.current.addFavorite(mockCharacter);
    });
    
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toEqual(mockCharacter);
    expect(result.current.isFavorite(mockCharacter.id)).toBe(true);
  });

  test('should not add duplicate characters', () => {
    const { result } = renderHook(() => useFavoritesStore());
    
    act(() => {
      result.current.addFavorite(mockCharacter);
      result.current.addFavorite(mockCharacter); // Intentar agregar el mismo personaje
    });
    
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toEqual(mockCharacter);
  });

  test('should remove a character from favorites', () => {
    const { result } = renderHook(() => useFavoritesStore());
    
    act(() => {
      result.current.addFavorite(mockCharacter);
      result.current.removeFavorite(mockCharacter.id);
    });
    
    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite(mockCharacter.id)).toBe(false);
  });

  test('should handle multiple characters', () => {
    const { result } = renderHook(() => useFavoritesStore());
    
    act(() => {
      result.current.addFavorite(mockCharacter);
      result.current.addFavorite(mockCharacter2);
    });
    
    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.isFavorite(mockCharacter.id)).toBe(true);
    expect(result.current.isFavorite(mockCharacter2.id)).toBe(true);
  });

  test('should clear all favorites', () => {
    const { result } = renderHook(() => useFavoritesStore());
    
    act(() => {
      result.current.addFavorite(mockCharacter);
      result.current.addFavorite(mockCharacter2);
      result.current.clearFavorites();
    });
    
    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite(mockCharacter.id)).toBe(false);
    expect(result.current.isFavorite(mockCharacter2.id)).toBe(false);
  });

  test('should return false for non-favorite characters', () => {
    const { result } = renderHook(() => useFavoritesStore());
    
    expect(result.current.isFavorite(999)).toBe(false);
  });

  test('should call notification callback when adding favorite', () => {
    const { result } = renderHook(() => useFavoritesStore());
    const mockOnAddFavorite = jest.fn();
    
    act(() => {
      result.current.setNotificationCallbacks({
        onAddFavorite: mockOnAddFavorite,
      });
    });

    act(() => {
      result.current.addFavorite(mockCharacter);
    });
    
    expect(mockOnAddFavorite).toHaveBeenCalledWith(mockCharacter);
  });

  test('should call notification callback when removing favorite', () => {
    const { result } = renderHook(() => useFavoritesStore());
    const mockOnRemoveFavorite = jest.fn();
    
    act(() => {
      result.current.addFavorite(mockCharacter);
      result.current.setNotificationCallbacks({
        onRemoveFavorite: mockOnRemoveFavorite,
      });
    });

    act(() => {
      result.current.removeFavorite(mockCharacter.id);
    });
    
    expect(mockOnRemoveFavorite).toHaveBeenCalledWith(mockCharacter.id);
  });

  test('should not call notification callback when not set', () => {
    const { result } = renderHook(() => useFavoritesStore());
    
    // No debería fallar si no hay callbacks configurados
    act(() => {
      result.current.addFavorite(mockCharacter);
      result.current.removeFavorite(mockCharacter.id);
    });
    
    expect(result.current.favorites).toHaveLength(0);
  });

  test('should update notification callbacks', () => {
    const { result } = renderHook(() => useFavoritesStore());
    const mockOnAddFavorite1 = jest.fn();
    const mockOnAddFavorite2 = jest.fn();
    
    act(() => {
      result.current.setNotificationCallbacks({
        onAddFavorite: mockOnAddFavorite1,
      });
    });

    act(() => {
      result.current.addFavorite(mockCharacter);
    });
    
    expect(mockOnAddFavorite1).toHaveBeenCalledWith(mockCharacter);
    
    // Actualizar callbacks
    act(() => {
      result.current.setNotificationCallbacks({
        onAddFavorite: mockOnAddFavorite2,
      });
    });

    act(() => {
      result.current.addFavorite(mockCharacter2);
    });
    
    expect(mockOnAddFavorite2).toHaveBeenCalledWith(mockCharacter2);
    expect(mockOnAddFavorite1).toHaveBeenCalledTimes(1); // No debería ser llamado de nuevo
  });

  test('should clear notification callbacks', () => {
    const { result } = renderHook(() => useFavoritesStore());
    const mockOnAddFavorite = jest.fn();
    
    act(() => {
      result.current.setNotificationCallbacks({
        onAddFavorite: mockOnAddFavorite,
      });
    });

    act(() => {
      result.current.setNotificationCallbacks({});
    });

    act(() => {
      result.current.addFavorite(mockCharacter);
    });
    
    expect(mockOnAddFavorite).not.toHaveBeenCalled();
  });
}); 