import type { EntryCategory, ExitCategory } from '@utils/types/models/transaction';
import type { TransactionRecord } from '@actions/transactions/types';

export interface TransactionFormData {
  type: 'entry' | 'exit';
  title: string;
  amount: number;
  category: EntryCategory | ExitCategory;
  completed: boolean;
  dueDate: Date | null;
  confirmationDate: Date | null;
  createdAt: Date | null;
}

export interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (result: any) => void;
  transaction?: TransactionRecord;
  selectedMonth?: Date;
}