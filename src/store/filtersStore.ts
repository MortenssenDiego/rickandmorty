import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialFilterOptions = {
  status: [],
  species: [],
  gender: [],
};

// @ts-ignore
export const useFiltersStore = create(
  // @ts-ignore
  persist(
    // @ts-ignore
    (set) => ({
      filterOptions: initialFilterOptions,
      isLoadingFilters: false,
      setFilterOptions: (options: any) => set({ filterOptions: options }),
      setLoadingFilters: (loading: boolean) => set({ isLoadingFilters: loading }),
      clearFilterOptions: () => set({ filterOptions: initialFilterOptions }),
    }),
    {
      name: 'filters-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 