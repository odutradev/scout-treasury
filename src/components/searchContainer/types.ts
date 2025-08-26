import type { ChangeEvent } from 'react';
import type { SvgIconComponent } from '@mui/icons-material';

export interface SearchContainerProps {
  searchValue: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  onFilterClick?: () => void;
  onAddClick?: () => void;
  addButtonText?: string;
  showAddButton?: boolean;
  showFilterButton?: boolean;
  addButtonIcon?: SvgIconComponent;
  disabled?: boolean;
}