import { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import { Character, ApiResponse, AppliedFilters } from '../types';
import { apiService } from '../services/api';

// Interfaz que define el retorno del hook de personajes
interface UseCharactersReturn {
  characters: Character[]; // Lista de personajes cargados
  loading: boolean; // Estado de carga inicial
  error: string | null; // Mensaje de error si existe
  hasMore: boolean; // Indica si hay más páginas para cargar
  loadMore: () => void; // Función para cargar más personajes
  refresh: () => void; // Función para refrescar la lista
  searchCharacters: (query: string) => void; // Función para buscar personajes
  filterCharacters: (filters: AppliedFilters) => void; // Función para filtrar personajes
  clearSearch: () => void; // Función para limpiar búsqueda
  searchQuery: string; // Query actual de búsqueda
  appliedFilters: AppliedFilters; // Filtros aplicados actualmente
  isPending: boolean; // Estado de transición para operaciones no bloqueantes
}

// Hook personalizado que maneja toda la lógica de personajes (API, paginación, búsqueda, filtros)
export const useCharacters = (): UseCharactersReturn => {
  // Estados locales del hook
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});
  
  // Hook de transición para operaciones no bloqueantes (nuevo en React 18)
  const [isPending, startTransition] = useTransition();

  // Función principal para obtener personajes de la API
  const fetchCharacters = useCallback(async (pageNum: number, append: boolean = false, filters?: AppliedFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      let response: ApiResponse<Character>;
      
      // Determinar qué tipo de llamada hacer según el estado actual
      if (searchQuery) {
        // Si hay búsqueda activa, usar la función de búsqueda
        response = await apiService.searchCharacters(searchQuery, pageNum);
      } else if (filters && Object.keys(filters).some(key => filters[key as keyof AppliedFilters])) {
        // Si hay filtros aplicados, usar la función de filtrado
        const filterParams: Record<string, string> = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value) filterParams[key] = value;
        });
        response = await apiService.filterCharacters(filterParams, pageNum);
      } else {
        // Si no hay búsqueda ni filtros, obtener todos los personajes
        response = await apiService.getCharacters(pageNum);
      }
      
      // Actualizar el estado según si es append o nueva carga
      if (append) {
        // Para append, agregar al final sin duplicados
        setCharacters(prev => {
          const existingIds = new Set(prev.map(char => char.id));
          const newCharacters = response.results.filter(char => !existingIds.has(char.id));
          return [...prev, ...newCharacters];
        });
      } else {
        // Para nueva carga, reemplazar completamente
        setCharacters(response.results);
      }
      
      // Actualizar si hay más páginas disponibles
      setHasMore(!!response.info.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Función para cargar más personajes (scroll infinito)
  const loadMore = useCallback(() => {
    if (!loading && hasMore && !isPending) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCharacters(nextPage, true, appliedFilters);
    }
  }, [loading, hasMore, page, fetchCharacters, appliedFilters, isPending]);

  // Función para refrescar la lista completa
  const refresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setSearchQuery('');
    setAppliedFilters({});
    fetchCharacters(1, false);
  }, [fetchCharacters]);

  // Función para buscar personajes con transición no bloqueante
  const searchCharacters = useCallback((query: string) => {
    startTransition(() => {
      setSearchQuery(query);
      setPage(1);
      setHasMore(true);
      setAppliedFilters({});
      fetchCharacters(1, false);
    });
  }, [fetchCharacters, startTransition]);

  // Función para filtrar personajes con transición no bloqueante
  const filterCharacters = useCallback((filters: AppliedFilters) => {
    startTransition(() => {
      setAppliedFilters(filters);
      setPage(1);
      setHasMore(true);
      setSearchQuery('');
      fetchCharacters(1, false, filters);
    });
  }, [fetchCharacters, startTransition]);

  // Función para limpiar búsqueda con transición no bloqueante
  const clearSearch = useCallback(() => {
    startTransition(() => {
      setSearchQuery('');
      setAppliedFilters({});
      setPage(1);
      setHasMore(true);
      fetchCharacters(1, false);
    });
  }, [fetchCharacters, startTransition]);

  // Memoización de valores para optimizar rendimiento
  const memoizedCharacters = useMemo(() => characters, [characters]);
  const memoizedAppliedFilters = useMemo(() => appliedFilters, [appliedFilters]);

  // Efecto para cargar personajes iniciales al montar el componente
  useEffect(() => {
    fetchCharacters(1, false);
  }, [fetchCharacters]);

  // Retornar todos los valores y funciones del hook
  return {
    characters: memoizedCharacters,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    searchCharacters,
    filterCharacters,
    clearSearch,
    searchQuery,
    appliedFilters: memoizedAppliedFilters,
    isPending,
  };
}; 