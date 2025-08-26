import type { TransactionRecord } from '@actions/transactions/types';

export interface TransactionItemProps {
  transaction: TransactionRecord;
  isLast: boolean;
  onUpdate: () => void;
}