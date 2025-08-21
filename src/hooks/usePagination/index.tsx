import { useState, useEffect, useRef } from 'react';

import type { PaginationMeta, PaginationOptions, PaginationOrError } from '@utils/types/action';
import type { UsePaginationResult } from './types';

const usePagination = <T,>(fetchFn: (page: number, limit: number) => PaginationOrError<T>, { page: initialPage = 1, limit: initialLimit = 10 }: PaginationOptions = {}): UsePaginationResult<T> => {
    const [meta, setMeta] = useState<PaginationMeta>({ totalCount: 0, currentPage: initialPage, totalPages: 0, limit: initialLimit, hasNext: false, hasPrev: false });
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState(initialLimit);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<T[]>([]);

    const fetchRef = useRef(fetchFn);
    useEffect(() => {
        fetchRef.current = fetchFn;
    }, [fetchFn]);

    const loadPage = async (currentPage: number, currentLimit: number) => {
        setLoading(true);
        setError(null);

        const result = await fetchRef.current(currentPage, currentLimit);
        if ('error' in result) {
            setData([]);
            setMeta({ totalCount: 0, currentPage, totalPages: 0, limit: currentLimit, hasNext: false, hasPrev: false });
            setError(result.error);
        } else {
            setData(result.data);
            setMeta(result.pagination);
        }

        setLoading(false);
    };

    useEffect(() => {
        let active = true;

        (async () => {
            setLoading(true);
            setError(null);

            const result = await fetchRef.current(page, limit);
            if (!active) return;

            if ('error' in result) {
                setData([]);
                setMeta({ totalCount: 0, currentPage: page, totalPages: 0, limit, hasNext: false, hasPrev: false });
                setError(result.error);
            } else {
                setData(result.data);
                setMeta(result.pagination);
            }

            setLoading(false);
        })();

        return () => {
            active = false;
        };
    }, [page, limit]);

    const refresh = () => loadPage(page, limit);

    return { data, meta, loading, error, page, limit, setPage, setLimit, refresh };
};

export default usePagination;