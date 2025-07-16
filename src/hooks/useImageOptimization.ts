import { useMemo, useCallback } from 'react';
import { ImageURISource } from 'react-native';

interface UseImageOptimizationReturn {
  getOptimizedImageSource: (uri: string) => ImageURISource;
  imageStyle: {
    width: number;
    height: number;
    borderRadius: number;
  };
}

export const useImageOptimization = (): UseImageOptimizationReturn => {
  const getOptimizedImageSource = useCallback((uri: string): ImageURISource => ({
    uri,
    cache: 'force-cache',
  }), []);

  const imageStyle = useMemo(() => ({
    width: 60,
    height: 60,
    borderRadius: 30,
  }), []);

  return {
    getOptimizedImageSource,
    imageStyle,
  };
}; 