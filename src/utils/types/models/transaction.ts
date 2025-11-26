export type ExitCategory = 
| "equipamentos" 
| "transporte"
| "atividades"
 |"materiais" 
| "eventos" 

export type EntryCategory = 
| "arrecadacao"
| "devolução" 
| "repasses" 
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