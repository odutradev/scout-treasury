import type { SvgIconComponent } from '@mui/icons-material';

export type MuiColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export interface StatsCardProps {
  title: string;
  value: string;
  valueColor: string;
  icon: SvgIconComponent;
  iconColor: MuiColor;
}