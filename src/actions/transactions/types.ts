import type { TransactionEntry, TransactionExit, ExitCategory, EntryCategory } from '@utils/types/models/transaction';

export interface TransactionRecord {
    _id: string;
    projectID: string;
    collection: string;
    data: TransactionData;
    createdAt: Date;
    lastUpdate: Date;
    expiresInDays?: number;
    expiresAt?: Date;
}

export interface TransactionData extends Omit<TransactionEntry | TransactionExit, 'category'> {
    type: 'entry' | 'exit';
    category: EntryCategory | ExitCategory;
    createdAt: string;
    lastUpdate?: string;
}

export interface TransactionCreateData {
    title: string;
    amount: number;
    category: EntryCategory | ExitCategory;
    completed?: boolean;
    dueDate?: Date;
    confirmationDate?: Date;
}

export interface TransactionUpdateData {
    title?: string;
    amount?: number;
    category?: EntryCategory | ExitCategory;
    completed?: boolean;
    dueDate?: Date;
    confirmationDate?: Date;
    lastUpdate?: string;
}

export interface TransactionFilters {
    page?: number;
    limit?: number;
    pagination?: boolean;
    category?: string;
    completed?: string;
    title?: string;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
    type?: 'entry' | 'exit';
    createdAfter?: string;
    createdBefore?: string;
}

export interface TransactionSummary {
    totalEntries: number;
    totalExits: number;
    balance: number;
    totalCompletedEntries: number;
    totalCompletedExits: number;
    totalPendingEntries: number;
    totalPendingExits: number;
    completedBalance: number;
    pendingBalance: number;
    entriesCount: number;
    exitsCount: number;
    completedEntriesCount: number;
    completedExitsCount: number;
    pendingEntriesCount: number;
    pendingExitsCount: number;
}

export interface MonthlyTransactionSummary {
    monthlyEntries: number;
    monthlyExits: number;
    monthlyPendingEntries: number;
    monthlyPendingExits: number;
    totalBalance: number;
    entriesCount: number;
    exitsCount: number;
    pendingEntriesCount: number;
    pendingExitsCount: number;
    totalPendingCount: number;
    month: number;
    year: number;
}

export interface CountResponse {
    count: number;
}

export interface EvalResponse {
    operation: string;
    field: string;
    result: number;
}

export interface EvalOperation {
    operation: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct';
    field: string;
    filters: Record<string, any>;
}