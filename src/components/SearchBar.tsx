import React, { useState, useEffect, useCallback, useDeferredValue } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import { useThemeStore } from '../store/themeStore';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(({
  onSearch,
  onClear,
  placeholder = 'Buscar personajes...',
  debounceMs = 500,
}) => {
  const [query, setQuery] = useState('');
  // @ts-ignore
  const { isDarkMode } = useThemeStore();
  const colors = theme[isDarkMode ? 'dark' : 'light'];

  const deferredQuery = useDeferredValue(query);

  const debouncedSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    } else {
      onClear();
    }
  }, [onSearch, onClear]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(deferredQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [deferredQuery, debouncedSearch, debounceMs]);

  const handleClear = useCallback(() => {
    setQuery('');
    onClear();
  }, [onClear]);

  return (
    <View style={[
      styles.container, 
      { backgroundColor: colors.surface, borderColor: colors.border }
    ]}>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <MaterialCommunityIcons 
            name="close" 
            size={20} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
}); 