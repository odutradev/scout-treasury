import { Receipt } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { Container } from './styles';

import type { EmptyStateProps } from './types';

const EmptyState = ({
  icon: Icon = Receipt,
  title = "Nenhum item encontrado",
  description = "Comece adicionando o primeiro item",
  iconSize = 64
}: EmptyStateProps) => {
  return (
    <Container>
      <Icon sx={{ fontSize: iconSize, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Container>
  );
};

export default EmptyState;