import { useMemo, useCallback } from 'react';
import { Character } from '../types';

interface UseOptimizedListReturn {
  getItemLayout: (data: any, index: number) => {
    length: number;
    offset: number;
    index: number;
  };
  keyExtractor: (item: Character) => string;
  initialNumToRender: number;
  maxToRenderPerBatch: number;
  windowSize: number;
  removeClippedSubviews: boolean;
  updateCellsBatchingPeriod: number;
}

export const useOptimizedList = (): UseOptimizedListReturn => {
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 84, // altura aproximada del CharacterCard
    offset: 84 * index,
    index,
  }), []);

  const keyExtractor = useCallback((item: Character) => item.id.toString(), []);

  const listConfig = useMemo(() => ({
    initialNumToRender: 10,
    maxToRenderPerBatch: 10,
    windowSize: 10,
    removeClippedSubviews: true,
    updateCellsBatchingPeriod: 50,
  }), []);

  return {
    getItemLayout,
    keyExtractor,
    ...listConfig,
  };
}; 