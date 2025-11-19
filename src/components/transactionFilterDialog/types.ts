export interface FilterValues {
  category: string;
  completed: 'all' | 'true' | 'false';
  minAmount: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
  type: 'all' | 'entry' | 'exit';
}

export interface AppliedFilters {
  category?: string;
  completed?: boolean;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  type?: 'entry' | 'exit';
}

export interface TransactionFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AppliedFilters) => void;
  currentFilters?: AppliedFilters;
}