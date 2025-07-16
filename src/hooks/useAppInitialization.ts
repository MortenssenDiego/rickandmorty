import { useState, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useFiltersStore } from '../store/filtersStore';

export const useAppInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Acceder a los stores para asegurar que se inicialicen
  // @ts-ignore
  const { isDarkMode } = useThemeStore();
  // @ts-ignore
  const { favorites } = useFavoritesStore();
  // @ts-ignore
  const { filterOptions } = useFiltersStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Esperar un momento para que los stores se inicialicen
        // y carguen los datos persistentes
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error al inicializar la app:', error);
        // Aún así marcar como inicializada para no bloquear la app
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  return {
    isInitialized,
    isLoading,
  };
}; 