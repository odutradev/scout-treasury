export interface ProjectExportData {
    [collection: string]: any[];
}

export interface ProjectStats {
    totalTransactions: number;
    totalEntries: number;
    totalExits: number;
    collectionsCount: number;
}

export interface ImportResult {
    imported: boolean;
    totalCount: number;
    collections: Record<string, number>;
}

export interface DeleteResult {
    deleted: boolean;
    deletedCount: number;
}