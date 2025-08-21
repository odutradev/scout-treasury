export type ExitCategory = 
| "equipamentos" 
| "manutencao" 
| "transporte"
 |"materiais" 
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
    amount: number;
    dueDate?: Date;
    title: string;
}

export interface TransactionExit {
    confirmationDate?: Date;
    category: ExitCategory;
    completed: boolean;
    amount: number;
    dueDate?: Date;
    title: string;
}