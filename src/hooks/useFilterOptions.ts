import { useEffect, useCallback, useMemo } from 'react';
import { useFiltersStore } from '../store/filtersStore';
import { apiService } from '../services/api';

export const useFilterOptions = () => {
  const { filterOptions, isLoadingFilters, setFilterOptions, setLoadingFilters } = useFiltersStore();

  const loadFilterOptions = useCallback(async () => {
    if (filterOptions.species.length > 0) {
      return;
    }

    try {
      setLoadingFilters(true);
      const options = await apiService.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setLoadingFilters(false);
    }
  }, [filterOptions.species.length, setFilterOptions, setLoadingFilters]);

  const memoizedFilterOptions = useMemo(() => filterOptions, [filterOptions]);

  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  return {
    filterOptions: memoizedFilterOptions,
    isLoadingFilters,
    loadFilterOptions,
  };
}; 