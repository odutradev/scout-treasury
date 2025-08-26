import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { TypeOrError, PaginationOrError, DeletedOrError } from '@utils/types/action';
import type { TransactionRecord, TransactionCreateData, TransactionUpdateData, TransactionSummary, TransactionFilters } from './types';

export const createTransactionEntry = async (data: TransactionCreateData): TypeOrError<TransactionRecord> => {
    try {
        const response = await api.post('/kv/transaction-entries/create', {
            data: {
                ...data,
                type: 'entry',
                createdAt: new Date().toISOString()
            }
        });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const createTransactionExit = async (data: TransactionCreateData): TypeOrError<TransactionRecord> => {
    try {
        const response = await api.post('/kv/transaction-exits/create', {
            data: {
                ...data,
                type: 'exit',
                createdAt: new Date().toISOString()
            }
        });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const getAllTransactionEntries = async (params?: TransactionFilters): PaginationOrError<TransactionRecord> => {
    try {
        const response = await api.get('/kv/transaction-entries/get-all', { params });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const getAllTransactionExits = async (params?: TransactionFilters): PaginationOrError<TransactionRecord> => {
    try {
        const response = await api.get('/kv/transaction-exits/get-all', { params });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const getAllTransactions = async (params?: TransactionFilters): TypeOrError<TransactionRecord[]> => {
    try {
        const [entriesResult, exitsResult] = await Promise.all([
            getAllTransactionEntries({ ...params, pagination: false }),
            getAllTransactionExits({ ...params, pagination: false })
        ]);

        if ('error' in entriesResult) return entriesResult;
        if ('error' in exitsResult) return exitsResult;

        const allTransactions = [
            ...entriesResult.data,
            ...exitsResult.data
        ].sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());

        return allTransactions;
    } catch (error) {
        return manageActionError(error);
    }
};

export const getTransactionById = async (id: string, type: 'entry' | 'exit'): TypeOrError<TransactionRecord> => {
    try {
        const collection = type === 'entry' ? 'transaction-entries' : 'transaction-exits';
        const response = await api.get(`/kv/${collection}/get/${id}`);
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const updateTransaction = async (id: string, type: 'entry' | 'exit', data: TransactionUpdateData): TypeOrError<TransactionRecord> => {
    try {
        const existingTransaction = await getTransactionById(id, type);
        
        if ('error' in existingTransaction) {
            return existingTransaction;
        }

        const collection = type === 'entry' ? 'transaction-entries' : 'transaction-exits';
        const response = await api.patch(`/kv/${collection}/update/${id}`, {
            data: {
                ...existingTransaction.data,
                ...data,
                lastUpdate: new Date().toISOString()
            }
        });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const deleteTransaction = async (id: string, type: 'entry' | 'exit'): DeletedOrError => {
    try {
        const collection = type === 'entry' ? 'transaction-entries' : 'transaction-exits';
        const response = await api.delete(`/kv/${collection}/delete/${id}`);
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const getTransactionSummary = async (filters?: TransactionFilters): TypeOrError<TransactionSummary> => {
    try {
        const allTransactions = await getAllTransactions({ ...filters, pagination: false });
        
        if ('error' in allTransactions) return allTransactions;

        const entries = allTransactions.filter(t => t.data.type === 'entry');
        const exits = allTransactions.filter(t => t.data.type === 'exit');

        const totalEntries = entries.reduce((sum, t) => sum + t.data.amount, 0);
        const totalExits = exits.reduce((sum, t) => sum + t.data.amount, 0);
        const balance = totalEntries - totalExits;

        const completedEntries = entries.filter(t => t.data.completed);
        const completedExits = exits.filter(t => t.data.completed);
        const pendingEntries = entries.filter(t => !t.data.completed);
        const pendingExits = exits.filter(t => !t.data.completed);

        const totalCompletedEntries = completedEntries.reduce((sum, t) => sum + t.data.amount, 0);
        const totalCompletedExits = completedExits.reduce((sum, t) => sum + t.data.amount, 0);
        const totalPendingEntries = pendingEntries.reduce((sum, t) => sum + t.data.amount, 0);
        const totalPendingExits = pendingExits.reduce((sum, t) => sum + t.data.amount, 0);

        return {
            totalEntries,
            totalExits,
            balance,
            totalCompletedEntries,
            totalCompletedExits,
            totalPendingEntries,
            totalPendingExits,
            completedBalance: totalCompletedEntries - totalCompletedExits,
            pendingBalance: totalPendingEntries - totalPendingExits,
            entriesCount: entries.length,
            exitsCount: exits.length,
            completedEntriesCount: completedEntries.length,
            completedExitsCount: completedExits.length,
            pendingEntriesCount: pendingEntries.length,
            pendingExitsCount: pendingExits.length
        };
    } catch (error) {
        return manageActionError(error);
    }
};

export const markTransactionAsCompleted = async (id: string, type: 'entry' | 'exit'): TypeOrError<TransactionRecord> => {
    try {
        const existingTransaction = await getTransactionById(id, type);
        
        if ('error' in existingTransaction) {
            return existingTransaction;
        }

        const collection = type === 'entry' ? 'transaction-entries' : 'transaction-exits';
        const response = await api.patch(`/kv/${collection}/update/${id}`, {
            data: {
                ...existingTransaction.data,
                completed: true,
                confirmationDate: new Date(),
                lastUpdate: new Date().toISOString()
            }
        });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const markTransactionAsPending = async (id: string, type: 'entry' | 'exit'): TypeOrError<TransactionRecord> => {
    try {
        const existingTransaction = await getTransactionById(id, type);
        
        if ('error' in existingTransaction) {
            return existingTransaction;
        }

        const collection = type === 'entry' ? 'transaction-entries' : 'transaction-exits';
        const response = await api.patch(`/kv/${collection}/update/${id}`, {
            data: {
                ...existingTransaction.data,
                completed: false,
                confirmationDate: undefined,
                lastUpdate: new Date().toISOString()
            }
        });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};