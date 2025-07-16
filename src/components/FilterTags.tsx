import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { theme } from '../theme';
import { useThemeStore } from '../store/themeStore';
import { FilterOptions, AppliedFilters } from '../types';

interface FilterTagsProps {
  filterOptions: FilterOptions;
  appliedFilters: AppliedFilters;
  onFilterChange: (filters: AppliedFilters) => void;
}

export const FilterTags: React.FC<FilterTagsProps> = React.memo(({
  filterOptions,
  appliedFilters,
  onFilterChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<keyof FilterOptions | null>(null);
  // @ts-ignore
  const { isDarkMode } = useThemeStore();
  const colors = theme[isDarkMode ? 'dark' : 'light'];

  const filterLabels = useMemo(() => ({
    status: 'Estado',
    species: 'Especie',
    gender: 'Género',
  }), []);

  const handleFilterSelect = useCallback((filterType: keyof FilterOptions, value: string) => {
    const newFilters = { ...appliedFilters };
    
    if (newFilters[filterType] === value) {
      delete newFilters[filterType];
    } else {
      newFilters[filterType] = value;
    }
    
    onFilterChange(newFilters);
    setModalVisible(false);
    setActiveFilter(null);
  }, [appliedFilters, onFilterChange]);

  const clearAllFilters = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);

  const hasActiveFilters = useMemo(() => Object.keys(appliedFilters).length > 0, [appliedFilters]);

  const modalContentStyle = useMemo(() => [
    styles.modalContent, 
    { backgroundColor: colors.surface }
  ], [colors.surface]);

  const modalTitleStyle = useMemo(() => [
    styles.modalTitle, 
    { color: colors.text }
  ], [colors.text]);

  const closeButtonStyle = useMemo(() => [
    styles.closeButton, 
    { backgroundColor: colors.border }
  ], [colors.border]);

  const closeTextStyle = useMemo(() => [
    styles.closeText, 
    { color: colors.text }
  ], [colors.text]);

  const clearButtonStyle = useMemo(() => [
    styles.clearButton, 
    { backgroundColor: colors.error }
  ], [colors.error]);

  const clearTextStyle = useMemo(() => [
    styles.clearText, 
    { color: colors.background }
  ], [colors.background]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {Object.entries(filterLabels).map(([key, label]) => {
          const filterKey = key as keyof FilterOptions;
          const isActive = appliedFilters[filterKey];
          
          const filterTagStyle = useMemo(() => [
            styles.filterTag,
            {
              backgroundColor: isActive ? colors.primary : colors.surface,
              borderColor: colors.border,
            },
          ], [isActive, colors.primary, colors.surface, colors.border]);

          const filterTextStyle = useMemo(() => [
            styles.filterText,
            { color: isActive ? colors.background : colors.text },
          ], [isActive, colors.background, colors.text]);

          const handlePress = useCallback(() => {
            setActiveFilter(filterKey);
            setModalVisible(true);
          }, [filterKey]);
          
          return (
            <TouchableOpacity
              key={key}
              style={filterTagStyle}
              onPress={handlePress}
            >
              <Text style={filterTextStyle}>
                {label}: {isActive || 'Todos'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {hasActiveFilters && (
        <TouchableOpacity
          style={clearButtonStyle}
          onPress={clearAllFilters}
        >
          <Text style={clearTextStyle}>
            Limpiar filtros
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={modalContentStyle}>
            <Text style={modalTitleStyle}>
              {activeFilter ? filterLabels[activeFilter] : ''}
            </Text>
            
            <ScrollView style={styles.optionsList}>
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  {
                    backgroundColor: !appliedFilters[activeFilter!] ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => handleFilterSelect(activeFilter!, '')}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: !appliedFilters[activeFilter!] ? colors.background : colors.text },
                  ]}
                >
                  Todos
                </Text>
              </TouchableOpacity>
              
              {activeFilter &&
                filterOptions[activeFilter].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor: appliedFilters[activeFilter] === option ? colors.primary : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => handleFilterSelect(activeFilter, option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: appliedFilters[activeFilter] === option ? colors.background : colors.text },
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            
            <TouchableOpacity
              style={closeButtonStyle}
              onPress={() => setModalVisible(false)}
            >
              <Text style={closeTextStyle}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

FilterTags.displayName = 'FilterTags';

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginVertical: 2,
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 