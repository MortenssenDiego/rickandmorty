export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  gender: "unknown" | "Female" | "Male" | "Genderless";
  episode: string[];
  created: string;
  image: string;
  name: string;
  species: string;
  status: "Dead" | "Alive" | "unknown";
  type: string;
  url: string;
  origin: CharacterLocation;
  location: CharacterLocation;
}

export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

export interface FilterOptions {
  status: string[];
  species: string[];
  gender: string[];
}

export interface AppliedFilters {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface Theme {
  dark: ThemeColors;
  light: ThemeColors;
}

export type NavigationParamList = {
  MainTabs: undefined;
  Characters: undefined;
  CharacterDetail: { character: Character };
  Favorites: undefined;
}; 