import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Character } from '../types';
import { theme } from '../theme';
import { useThemeStore } from '../store/themeStore';
import { useImageOptimization } from '../hooks/useImageOptimization';
import { translateStatus } from '../utils/statusTranslator';

interface CharacterCardProps {
  character: Character;
  onPress: (character: Character) => void;
}

const { width } = Dimensions.get('window');

export const CharacterCard: React.FC<CharacterCardProps> = React.memo(({ character, onPress }) => {
  // @ts-ignore
  const { isDarkMode } = useThemeStore();
  const colors = theme[isDarkMode ? 'dark' : 'light'];
  const { getOptimizedImageSource, imageStyle } = useImageOptimization();

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Alive':
        return colors.success;
      case 'Dead':
        return colors.error;
      default:
        return colors.warning;
    }
  }, [colors.success, colors.error, colors.warning]);

  const statusColor = useMemo(() => getStatusColor(character.status), [getStatusColor, character.status]);

  const handlePress = useCallback(() => {
    onPress(character);
  }, [onPress, character]);

  const optimizedImageSource = useMemo(() => 
    getOptimizedImageSource(character.image), 
    [getOptimizedImageSource, character.image]
  );

  // Traducir el estado del personaje
  const translatedStatus = useMemo(() => translateStatus(character.status), [character.status]);

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { backgroundColor: colors.surface, borderColor: colors.border }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image source={optimizedImageSource} style={[styles.image, imageStyle]} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {character.name}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.status, { color: colors.textSecondary }]}>
            {translatedStatus} - {character.species}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

CharacterCard.displayName = 'CharacterCard';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 14,
  },
}); 