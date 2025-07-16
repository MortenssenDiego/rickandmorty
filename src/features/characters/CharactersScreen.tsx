import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CharacterCard } from '../../components/CharacterCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorView } from '../../components/ErrorView';
import { SearchBar } from '../../components/SearchBar';
import { FilterTags } from '../../components/FilterTags';
import { InitialLoader } from '../../components/InitialLoader';
import { useCharacters } from '../../hooks/useCharacters';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import { useOptimizedList } from '../../hooks/useOptimizedList';
import { Character, NavigationParamList } from '../../types';
import { theme } from '../../theme';
import { useThemeStore } from '../../store/themeStore';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

// Tipo para la navegación de esta pantalla
type CharactersScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Characters'>;

// Pantalla principal que muestra la lista de personajes de Rick & Morty
export const CharactersScreen: React.FC = () => {
  const navigation = useNavigation<CharactersScreenNavigationProp>();
  // @ts-ignore
  const { isDarkMode } = useThemeStore();
  const colors = theme[isDarkMode ? 'dark' : 'light'];
  
  // Hook personalizado que maneja toda la lógica de personajes (API, paginación, búsqueda, filtros)
  const { 
    characters, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refresh, 
    searchCharacters, 
    filterCharacters, 
    clearSearch, 
    appliedFilters,
    isPending // Estado de transición para operaciones no bloqueantes
  } = useCharacters();
  
  // Hook para obtener las opciones de filtros dinámicos
  const { filterOptions, isLoadingFilters } = useFilterOptions();
  
  // Hook para optimización de rendimiento de la lista
  const optimizedListConfig = useOptimizedList();

  // Hook para manejar toast
  const { toast, showError, hideToast } = useToast();

  // Mostrar error en toast cuando hay error
  React.useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  // Función memoizada para navegar al detalle del personaje
  const handleCharacterPress = useCallback((character: Character) => {
    navigation.navigate('CharacterDetail', { character });
  }, [navigation]);

  // Función memoizada para renderizar cada item de la lista
  const renderItem = useCallback(({ item }: { item: Character }) => (
    <CharacterCard character={item} onPress={handleCharacterPress} />
  ), [handleCharacterPress]);

  // Función memoizada para mostrar el spinner de carga al final de la lista
  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return <LoadingSpinner size="small" />;
  }, [hasMore]);

  // Función memoizada para cargar más personajes cuando se llega al final
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && !isPending) {
      loadMore();
    }
  }, [loading, hasMore, loadMore, isPending]);

  // RefreshControl memoizado para el pull-to-refresh
  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={loading && characters.length === 0}
      onRefresh={refresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
    />
  ), [loading, characters.length, refresh, colors.primary]);

  // Estilos memoizados para evitar recálculos innecesarios
  const containerStyle = useMemo(() => [
    styles.container, 
    { backgroundColor: colors.background }
  ], [colors.background]);

  const listContainerStyle = useMemo(() => styles.listContainer, []);

  // Indicador de estado pendiente para operaciones no bloqueantes (useTransition)
  const pendingIndicator = useMemo(() => {
    if (!isPending) return null;
    return (
      <View style={[styles.pendingContainer, { backgroundColor: colors.primary }]}>
        <MaterialCommunityIcons 
          name="sync" 
          size={16} 
          color={colors.background} 
          style={styles.pendingIcon}
        />
        <Text style={[styles.pendingText, { color: colors.background }]}>
          Actualizando resultados...
        </Text>
      </View>
    );
  }, [isPending, colors.primary, colors.background]);

  // Mostrar loader inicial mientras se cargan las opciones de filtros
  if (isLoadingFilters) {
    return <InitialLoader />;
  }

  // Mostrar error si no hay personajes cargados y hay un error
  if (error && characters.length === 0) {
    return (
      <>
        <ErrorView message={error} onRetry={refresh} />
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={hideToast}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      {/* Indicador de estado pendiente para operaciones no bloqueantes */}
      {pendingIndicator}
      
      {/* Barra de búsqueda */}
      <SearchBar onSearch={searchCharacters} onClear={clearSearch} placeholder="Buscar personajes por nombre..." />
      
      {/* Tags de filtros */}
      <FilterTags 
        filterOptions={filterOptions} 
        appliedFilters={appliedFilters}
        onFilterChange={filterCharacters}
      />
      
      {/* Lista de personajes */}
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={optimizedListConfig.keyExtractor}
        contentContainerStyle={listContainerStyle}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        // Configuraciones de optimización para mejor rendimiento
        removeClippedSubviews={optimizedListConfig.removeClippedSubviews}
        maxToRenderPerBatch={optimizedListConfig.maxToRenderPerBatch}
        windowSize={optimizedListConfig.windowSize}
        initialNumToRender={optimizedListConfig.initialNumToRender}
        getItemLayout={optimizedListConfig.getItemLayout}
        updateCellsBatchingPeriod={optimizedListConfig.updateCellsBatchingPeriod}
      />

      {/* Toast para mostrar errores */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pendingIcon: {
    marginRight: 8,
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 