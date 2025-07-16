import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CharacterCard } from '../../components/CharacterCard';
import { useFavoritesStore } from '../../store/favoritesStore';
import { Character, NavigationParamList } from '../../types';
import { theme } from '../../theme';
import { useThemeStore } from '../../store/themeStore';

// Tipo para la navegación de esta pantalla
type FavoritesScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Favorites'>;

// Pantalla que muestra la lista de personajes marcados como favoritos
export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { isDarkMode } = useThemeStore();
  const colors = theme[isDarkMode ? 'dark' : 'light'];
  
  // Obtener la lista de favoritos del store global
  const { favorites } = useFavoritesStore();

  // Función para navegar al detalle del personaje cuando se presiona una tarjeta
  const handleCharacterPress = (character: Character) => {
    navigation.navigate('CharacterDetail', { character });
  };

  // Función para renderizar cada item de la lista de favoritos
  const renderItem = ({ item }: { item: Character }) => (
    <CharacterCard character={item} onPress={handleCharacterPress} />
  );

  // Componente que se muestra cuando no hay favoritos
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No hay favoritos aún
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        ¡Explora personajes y agrégalos a tus favoritos!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Lista de personajes favoritos */}
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          favorites.length === 0 && styles.emptyListContainer, // Centrar contenido si no hay favoritos
        ]}
        ListEmptyComponent={renderEmptyState} // Mostrar mensaje cuando no hay favoritos
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// Estilos de la pantalla de favoritos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center', // Centrar el mensaje de estado vacío
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 