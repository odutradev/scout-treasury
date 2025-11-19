import { useState, useEffect, useCallback } from 'react';

import type { PaginationMeta, PaginationOptions, PaginationOrError } from '@utils/types/action';
import type { UsePaginationResult } from './types';

const usePagination = <T,>(
  fetchFn: (page: number, limit: number) => PaginationOrError<T>, 
  { page: initialPage = 1, limit: initialLimit = 30 }: PaginationOptions = {}
): UsePaginationResult<T> => {
  const [meta, setMeta] = useState<PaginationMeta>({ 
    totalCount: 0, 
    currentPage: initialPage, 
    totalPages: 0, 
    limit: initialLimit, 
    hasNext: false, 
    hasPrev: false 
  });
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);

  const loadPage = useCallback(async (currentPage: number, currentLimit: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(currentPage, currentLimit);
      
      if ('error' in result) {
        setData([]);
        setMeta({ 
          totalCount: 0, 
          currentPage, 
          totalPages: 0, 
          limit: currentLimit, 
          hasNext: false, 
          hasPrev: false 
        });
        setError(result.error);
      } else {
        setData(result.data);
        setMeta(result.pagination);
      }
    } catch (error) {
      setData([]);
      setMeta({ 
        totalCount: 0, 
        currentPage, 
        totalPages: 0, 
        limit: currentLimit, 
        hasNext: false, 
        hasPrev: false 
      });
      setError('Erro ao carregar dados');
      console.error('Erro no usePagination:', error);
    }

    setLoading(false);
  }, [fetchFn]);

  useEffect(() => {
    loadPage(page, limit);
  }, [loadPage, page, limit]);

  const refresh = useCallback(() => {
    loadPage(page, limit);
  }, [loadPage, page, limit]);

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return { 
    data, 
    meta, 
    loading, 
    error, 
    page, 
    limit, 
    setPage: handleSetPage, 
    setLimit: handleSetLimit, 
    refresh 
  };
};

export default usePagination;