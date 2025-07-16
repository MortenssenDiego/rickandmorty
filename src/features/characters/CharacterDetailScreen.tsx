import React, { useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationParamList } from '../../types';
import { theme } from '../../theme';
import { useThemeStore } from '../../store/themeStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { translateStatus, translateGender } from '../../utils/statusTranslator';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';

// Tipos para la navegación y parámetros de ruta
type CharacterDetailRouteProp = RouteProp<NavigationParamList, 'CharacterDetail'>;
type CharacterDetailNavigationProp = NativeStackNavigationProp<NavigationParamList, 'CharacterDetail'>;

// Pantalla de detalle que muestra información completa del personaje seleccionado
export const CharacterDetailScreen: React.FC = () => {
  const route = useRoute<CharacterDetailRouteProp>();
  const navigation = useNavigation<CharacterDetailNavigationProp>();
  const { character } = route.params; // Datos del personaje recibidos por navegación
  
  // @ts-ignore
  const { isDarkMode } = useThemeStore();
  const colors = theme[isDarkMode ? 'dark' : 'light'];
  
  // Hook del store de favoritos para gestionar el estado global
  // @ts-ignore
  const { favorites, addFavorite, removeFavorite, isFavorite, setNotificationCallbacks } = useFavoritesStore();
  const isCharacterFavorite = isFavorite(character.id);

  // Hook para manejar toast
  const { toast, showSuccess, showInfo, hideToast } = useToast();

  // Configurar callbacks de notificación
  useEffect(() => {
    setNotificationCallbacks({
      onAddFavorite: (character) => {
        showSuccess(`${character.name} agregado a favoritos`);
      },
      onRemoveFavorite: (characterId) => {
        showInfo('Personaje removido de favoritos');
      },
    });

    // Cleanup al desmontar
    return () => {
      setNotificationCallbacks({});
    };
  }, [setNotificationCallbacks, showSuccess, showInfo]);

  // Función memoizada para agregar/quitar de favoritos
  const handleToggleFavorite = useCallback(() => {
    if (isCharacterFavorite) {
      removeFavorite(character.id);
    } else {
      addFavorite(character);
    }
  }, [isCharacterFavorite, removeFavorite, addFavorite, character]);

  // Función memoizada para obtener el color del estado del personaje
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Alive':
        return colors.success; // Verde para vivo
      case 'Dead':
        return colors.error; // Rojo para muerto
      default:
        return colors.warning; // Amarillo para desconocido
    }
  }, [colors.success, colors.error, colors.warning]);

  // Color del estado memoizado para evitar recálculos
  const statusColor = useMemo(() => getStatusColor(character.status), [getStatusColor, character.status]);

  // Datos de información del personaje memoizados para evitar recreaciones
  const infoRows = useMemo(() => [
    {
      label: 'Estado:',
      value: translateStatus(character.status),
      isStatus: true, // Indica que debe mostrar el punto de color
    },
    {
      label: 'Especie:',
      value: character.species,
    },
    {
      label: 'Tipo:',
      value: character.type || 'Desconocido',
    },
    {
      label: 'Género:',
      value: translateGender(character.gender),
    },
    {
      label: 'Origen:',
      value: character.origin.name,
    },
    {
      label: 'Ubicación:',
      value: character.location.name,
    },
    {
      label: 'Episodios:',
      value: character.episode.length.toString(),
    },
  ], [character]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Contenedor de la imagen del personaje */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: character.image }} style={styles.image} />
        </View>
        
        {/* Contenedor principal de información */}
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          {/* Header con nombre y botón de favorito */}
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.text }]}>{character.name}</Text>
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                {
                  backgroundColor: isCharacterFavorite ? colors.primary : colors.border,
                },
              ]}
              onPress={handleToggleFavorite}
              testID="favorite-button"
              accessibilityLabel={isCharacterFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <MaterialCommunityIcons 
                name={isCharacterFavorite ? 'heart' : 'heart-outline'} 
                size={24} 
                color={isCharacterFavorite ? colors.background : colors.text} 
              />
            </TouchableOpacity>
          </View>

          {/* Sección de información detallada del personaje */}
          <View style={styles.infoSection}>
            {infoRows.map((row, index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>{row.label}</Text>
                {row.isStatus ? (
                  // Para el estado, mostrar punto de color + texto
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusValueStyle, { color: colors.text }]}>{row.value}</Text>
                  </View>
                ) : (
                  // Para otros campos, mostrar solo texto
                  <Text style={[styles.value, { color: colors.text }]}>{row.value}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Toast para mostrar notificaciones */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};

// Estilos de la pantalla de detalle
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, // Imagen circular
    borderWidth: 4,
    borderColor: '#00FF41', // Borde verde del portal de Rick & Morty
  },
  content: {
    flex: 1,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusValueStyle: {
    fontSize: 16,
    textAlign: 'left',
  },
}); 