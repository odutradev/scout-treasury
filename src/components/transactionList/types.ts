import type { TransactionRecord } from '@actions/transactions/types';

export interface TransactionListProps {
  transactions: TransactionRecord[];
  onTransactionUpdate: () => void;
  onTransactionEdit?: (transaction: TransactionRecord) => void;
}