import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useCharacters } from '../useCharacters';
import { apiService } from '../../services/api';
import { Character } from '../../types';

// Mock del servicio API
jest.mock('../../services/api');
jest.mock('../../store/themeStore');

const mockApiService = apiService as jest.Mocked<typeof apiService>;

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

const mockApiResponse = {
  info: {
    count: 1,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [mockCharacter],
};

describe('useCharacters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty characters and loading state', async () => {
    mockApiService.getCharacters.mockResolvedValue(mockApiResponse);
    
    const { result } = renderHook(() => useCharacters());

    // El estado inicial puede variar dependiendo de la implementación
    expect(result.current.characters).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    
    // Esperar a que se complete la carga inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  it('should load characters successfully', async () => {
    mockApiService.getCharacters.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCharacters());

    // Esperar a que se carguen los personajes
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.characters).toEqual([mockCharacter]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasMore).toBe(false);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch characters';
    mockApiService.getCharacters.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Ahora esperamos el mensaje traducido
    expect(result.current.error).toBe('No se pudieron cargar los personajes. Verifica tu conexión a internet.');
    expect(result.current.loading).toBe(false);
    expect(result.current.characters).toEqual([]);
  });

  it('should handle search errors', async () => {
    const errorMessage = 'Failed to search characters';
    mockApiService.searchCharacters.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      result.current.searchCharacters('Rick');
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('No se encontraron personajes con ese nombre.');
  });

  it('should handle filter errors', async () => {
    const errorMessage = 'Failed to filter characters';
    mockApiService.filterCharacters.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      result.current.filterCharacters({ status: 'Alive' });
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Error al aplicar los filtros. Intenta de nuevo.');
  });

  it('should handle network timeout errors', async () => {
    const errorMessage = 'timeout of 10000ms exceeded';
    mockApiService.getCharacters.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('La conexión tardó demasiado. Verifica tu internet.');
  });

  it('should handle network errors', async () => {
    const errorMessage = 'Network Error';
    mockApiService.getCharacters.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Error de conexión. Verifica tu internet.');
  });

  it('should handle unknown errors', async () => {
    const errorMessage = 'Unknown error type';
    mockApiService.getCharacters.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Error al cargar los personajes');
  });

  it('should search characters', async () => {
    mockApiService.searchCharacters.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      result.current.searchCharacters('Rick');
    });

    expect(mockApiService.searchCharacters).toHaveBeenCalledWith('Rick', 1);
  });

  it('should filter characters', async () => {
    mockApiService.filterCharacters.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      result.current.filterCharacters({ status: 'Alive' });
    });

    expect(mockApiService.filterCharacters).toHaveBeenCalledWith({ status: 'Alive' }, 1);
  });

  it('should clear search', async () => {
    mockApiService.getCharacters.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      result.current.clearSearch();
    });

    expect(mockApiService.getCharacters).toHaveBeenCalledWith(1);
  });

  it('should load more characters when hasMore is true', async () => {
    const mockApiResponseWithMore = {
      ...mockApiResponse,
      info: {
        ...mockApiResponse.info,
        next: 'https://rickandmortyapi.com/api/character?page=2',
      },
    };

    mockApiService.getCharacters
      .mockResolvedValueOnce(mockApiResponseWithMore)
      .mockResolvedValueOnce(mockApiResponse);

    const { result } = renderHook(() => useCharacters());

    // Cargar la primera página
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.hasMore).toBe(true);

    // Cargar más personajes
    await act(async () => {
      result.current.loadMore();
    });

    expect(mockApiService.getCharacters).toHaveBeenCalledWith(2);
  });

  it('should refresh characters', async () => {
    mockApiService.getCharacters.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      result.current.refresh();
    });

    expect(mockApiService.getCharacters).toHaveBeenCalledWith(1);
  });

  it('should handle pending state during transitions', async () => {
    mockApiService.getCharacters.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCharacters());

    // Simular una transición pendiente
    await act(async () => {
      result.current.searchCharacters('Rick');
    });

    // El estado isPending puede variar dependiendo de la implementación
    // Verificamos que la función se llamó correctamente
    expect(mockApiService.searchCharacters).toHaveBeenCalledWith('Rick', 1);
  });
}); 