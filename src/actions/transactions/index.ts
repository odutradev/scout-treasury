import { manageActionError } from '@utils/functions/action';
import api from '@utils/functions/api';

import type { TypeOrError, PaginationOrError, DeletedOrError } from '@utils/types/action';
import type { TransactionRecord, TransactionCreateData, TransactionUpdateData, TransactionSummary, TransactionFilters, MonthlyTransactionSummary, EvalOperation, CountResponse, EvalResponse } from './types';

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
        const collection = type === 'entry' ? 'transaction-entries' : 'transaction-exits';
        const response = await api.patch(`/kv/${collection}/update/${id}`, {
            data: {
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

export const countTransactions = async (collection: 'transaction-entries' | 'transaction-exits', filters?: Record<string, any>): TypeOrError<CountResponse> => {
    try {
        const response = await api.get(`/kv/${collection}/count`, { params: filters });
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const evalTransactions = async (collection: 'transaction-entries' | 'transaction-exits', operation: EvalOperation): TypeOrError<EvalResponse> => {
    try {
        const response = await api.post(`/kv/${collection}/eval`, operation);
        return response.data;
    } catch (error) {
        return manageActionError(error);
    }
};

export const getMonthlyTransactionSummary = async (year?: number, month?: number): TypeOrError<MonthlyTransactionSummary> => {
    try {
        const currentDate = new Date();
        const targetYear = year || currentDate.getFullYear();
        const targetMonth = month || currentDate.getMonth() + 1;
        
        const startDate = new Date(targetYear, targetMonth - 1, 1).toISOString();
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999).toISOString();
        
        const filters = {
            'data.completed': true,
            createdAfter: startDate,
            createdBefore: endDate
        };

        const [
            totalEntriesResult,
            totalExitsResult,
            countEntriesResult,
            countExitsResult,
            pendingEntriesCountResult,
            pendingExitsCountResult
        ] = await Promise.all([
            evalTransactions('transaction-entries', {
                operation: 'sum',
                field: 'data.amount',
                filters
            }),
            evalTransactions('transaction-exits', {
                operation: 'sum',
                field: 'data.amount',
                filters
            }),
            countTransactions('transaction-entries', filters),
            countTransactions('transaction-exits', filters),
            countTransactions('transaction-entries', {
                'data.completed': false,
                createdAfter: startDate,
                createdBefore: endDate
            }),
            countTransactions('transaction-exits', {
                'data.completed': false,
                createdAfter: startDate,
                createdBefore: endDate
            })
        ]);

        if ('error' in totalEntriesResult) return totalEntriesResult;
        if ('error' in totalExitsResult) return totalExitsResult;
        if ('error' in countEntriesResult) return countEntriesResult;
        if ('error' in countExitsResult) return countExitsResult;
        if ('error' in pendingEntriesCountResult) return pendingEntriesCountResult;
        if ('error' in pendingExitsCountResult) return pendingExitsCountResult;

        const monthlyEntries = totalEntriesResult.result || 0;
        const monthlyExits = totalExitsResult.result || 0;
        const entriesCount = countEntriesResult.count || 0;
        const exitsCount = countExitsResult.count || 0;
        const pendingEntriesCount = pendingEntriesCountResult.count || 0;
        const pendingExitsCount = pendingExitsCountResult.count || 0;

        const [totalEntriesAllTimeResult, totalExitsAllTimeResult] = await Promise.all([
            evalTransactions('transaction-entries', {
                operation: 'sum',
                field: 'data.amount',
                filters: { 'data.completed': true }
            }),
            evalTransactions('transaction-exits', {
                operation: 'sum',
                field: 'data.amount',
                filters: { 'data.completed': true }
            })
        ]);

        if ('error' in totalEntriesAllTimeResult) return totalEntriesAllTimeResult;
        if ('error' in totalExitsAllTimeResult) return totalExitsAllTimeResult;

        const totalBalance = (totalEntriesAllTimeResult.result || 0) - (totalExitsAllTimeResult.result || 0);

        return {
            monthlyEntries,
            monthlyExits,
            totalBalance,
            entriesCount,
            exitsCount,
            pendingEntriesCount,
            pendingExitsCount,
            totalPendingCount: pendingEntriesCount + pendingExitsCount,
            month: targetMonth,
            year: targetYear
        };
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
        return await updateTransaction(id, type, {
            completed: true,
            confirmationDate: new Date()
        });
    } catch (error) {
        return manageActionError(error);
    }
};

export const markTransactionAsPending = async (id: string, type: 'entry' | 'exit'): TypeOrError<TransactionRecord> => {
    try {
        return await updateTransaction(id, type, {
            completed: false,
            confirmationDate: undefined
        });
    } catch (error) {
        return manageActionError(error);
    }
};