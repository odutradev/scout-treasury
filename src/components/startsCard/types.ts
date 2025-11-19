import type { SvgIconComponent } from '@mui/icons-material';
import type { ReactNode } from 'react';

export type MuiColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export interface StatsCardProps {
  title: string;
  value: string;
  valueColor: string;
  icon: SvgIconComponent;
  iconColor: MuiColor;
  tooltipContent?: ReactNode;
}