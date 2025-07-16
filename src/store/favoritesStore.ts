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
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  addFavorite: (character: Character) => {
    set((state) => {
      const isAlreadyFavorite = state.favorites.some((fav) => fav.id === character.id);
      if (isAlreadyFavorite) {
        return state;
      }
      return {
        favorites: [character, ...state.favorites]
      };
    });
  },
  removeFavorite: (characterId: number) => {
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav.id !== characterId)
    }));
  },
  isFavorite: (characterId: number) => {
    const { favorites } = get();
    return favorites.some((fav) => fav.id === characterId);
  },
  clearFavorites: () => {
    set({ favorites: [] });
  },
})); 