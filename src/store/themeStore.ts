import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// @ts-ignore
export const useThemeStore = create(
  // @ts-ignore
  persist(
    // @ts-ignore
    (set, get) => ({
      isDarkMode: false,
      toggleTheme: () => {
        set((state: any) => {
          const newDarkMode = !state.isDarkMode;
          return { isDarkMode: newDarkMode };
        });
      },
      setTheme: (isDark: boolean) => {
        set({ isDarkMode: isDark });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 