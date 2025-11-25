import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { TypeOrError, DeletedOrError } from '@utils/types/action';
import type { ProjectExportData, ProjectStats, ImportResult } from './types';

export const exportProject = async (format: 'json' | 'csv' = 'json'): TypeOrError<Blob> => {
    try {
        const response = await api.get('/kv/export', {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const importProject = async (data: ProjectExportData): TypeOrError<ImportResult> => {
    try {
        const response = await api.post('/kv/import', { data });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const deleteProject = async (): DeletedOrError => {
    try {
        const response = await api.delete('/kv/delete');
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const getProjectStats = async (): TypeOrError<ProjectStats> => {
    try {
        const [entriesCount, exitsCount] = await Promise.all([
            api.get('/kv/transaction-entries/count'),
            api.get('/kv/transaction-exits/count')
        ]);

        const totalEntries = entriesCount.data.count || 0;
        const totalExits = exitsCount.data.count || 0;

        return {
            totalTransactions: totalEntries + totalExits,
            totalEntries,
            totalExits,
            collectionsCount: 2
        };
    } catch (error) {
        return manageActionError(error);
    }
};

export const exportCollection = async (collection: string, format: 'json' | 'csv' = 'json'): TypeOrError<Blob> => {
    try {
        const response = await api.get(`/kv/${collection}/export`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const deleteCollection = async (collection: string): DeletedOrError => {
    try {
        const response = await api.delete(`/kv/${collection}/delete`);
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};