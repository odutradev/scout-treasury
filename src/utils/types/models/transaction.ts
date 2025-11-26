export type ExitCategory = 
| "equipamentos" 
| "transporte"
| "manutencao"
| "materiais" 
| "eventos" 

export type EntryCategory = 
| "mensalidades"
| "arrecadacao"
| "doacoes" 
| "eventos" 
| "vendas" 

export interface TransactionEntry {
    category: EntryCategory;
    confirmationDate?: Date;
    completed: boolean;
    description?: string;
    amount: number;
    dueDate?: Date;
    title: string;
}

export interface TransactionExit {
    confirmationDate?: Date;
    category: ExitCategory;
    completed: boolean;
    description?: string;
    amount: number;
    dueDate?: Date;
    title: string;
}