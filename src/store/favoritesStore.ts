import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character } from '../types';

interface FavoritesState {
  favorites: Character[];
  addFavorite: (character: Character) => void;
  removeFavorite: (characterId: number) => void;
  isFavorite: (characterId: number) => boolean;
  clearFavorites: () => void;
  // Callbacks para notificaciones
  onAddFavorite?: (character: Character) => void;
  onRemoveFavorite?: (characterId: number) => void;
  setNotificationCallbacks: (callbacks: {
    onAddFavorite?: (character: Character) => void;
    onRemoveFavorite?: (characterId: number) => void;
  }) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  addFavorite: (character: Character) => {
    set((state) => {
      const isAlreadyFavorite = state.favorites.some((fav) => fav.id === character.id);
      if (isAlreadyFavorite) {
        return state;
      }
      
      // Llamar callback de notificación si existe
      if (state.onAddFavorite) {
        state.onAddFavorite(character);
      }
      
      return {
        favorites: [character, ...state.favorites]
      };
    });
  },
  removeFavorite: (characterId: number) => {
    set((state) => {
      // Llamar callback de notificación si existe
      if (state.onRemoveFavorite) {
        state.onRemoveFavorite(characterId);
      }
      
      return {
        favorites: state.favorites.filter((fav) => fav.id !== characterId)
      };
    });
  },
  isFavorite: (characterId: number) => {
    const { favorites } = get();
    return favorites.some((fav) => fav.id === characterId);
  },
  clearFavorites: () => {
    set({ favorites: [] });
  },
  onAddFavorite: undefined,
  onRemoveFavorite: undefined,
  setNotificationCallbacks: (callbacks) => {
    set({
      onAddFavorite: callbacks.onAddFavorite,
      onRemoveFavorite: callbacks.onRemoveFavorite,
    });
  },
})); 