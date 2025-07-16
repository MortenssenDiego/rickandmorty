import axios from 'axios';
import { Character, ApiResponse, FilterOptions } from '../types';

// Configuración base de axios para la API de Rick & Morty
const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  timeout: 10000,
});

// Interceptor para manejar errores de manera consistente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    throw new Error(message);
  }
);

// Servicio API para personajes de Rick & Morty
export const apiService = {
  // Obtener personajes con paginación
  async getCharacters(page: number = 1): Promise<ApiResponse<Character>> {
    try {
      const response = await api.get(`/character?page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch characters');
    }
  },

  // Obtener un personaje específico por ID
  async getCharacter(id: number): Promise<Character> {
    try {
      const response = await api.get(`/character/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch character');
    }
  },

  // Buscar personajes por nombre
  async searchCharacters(name: string, page: number = 1): Promise<ApiResponse<Character>> {
    try {
      const response = await api.get(`/character?name=${encodeURIComponent(name)}&page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to search characters');
    }
  },

  // Filtrar personajes por múltiples criterios
  async filterCharacters(filters: Record<string, string>, page: number = 1): Promise<ApiResponse<Character>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('page', page.toString());
      
      const response = await api.get(`/character?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to filter characters');
    }
  },

  // Obtener todas las opciones de filtros disponibles
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      // Obtener todas las páginas para extraer opciones únicas
      const allCharacters: Character[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await this.getCharacters(page);
        allCharacters.push(...response.results);
        hasMore = !!response.info.next;
        page++;
      }

      // Extraer opciones únicas
      const statusOptions = [...new Set(allCharacters.map(char => char.status))];
      const speciesOptions = [...new Set(allCharacters.map(char => char.species))];
      const genderOptions = [...new Set(allCharacters.map(char => char.gender))];

      return {
        status: statusOptions,
        species: speciesOptions,
        gender: genderOptions,
      };
    } catch (error) {
      console.error('Error loading filter options:', error);
      return {
        status: [],
        species: [],
        gender: [],
      };
    }
  },
}; 