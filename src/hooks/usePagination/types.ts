import { PaginationMeta } from '@utils/types/action'

export interface UsePaginationResult<T> {
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    error: string | null;
    meta: PaginationMeta;
    refresh: () => void;
    loading: boolean;
    limit: number;
    page: number;
    data: T[];
}