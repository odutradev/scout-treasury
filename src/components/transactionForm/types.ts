import type { EntryCategory, ExitCategory } from '@utils/types/models/transaction';

export interface TransactionFormData {
  type: 'entry' | 'exit';
  title: string;
  amount: number;
  category: EntryCategory | ExitCategory;
  completed: boolean;
  dueDate: Date | null;
  confirmationDate: Date | null;
}

export interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (result: any) => void;
}