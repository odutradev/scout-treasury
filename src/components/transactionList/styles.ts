import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  overflow: 'hidden',

  '@media (max-width: 600px)': {
    borderRadius: '4px'
  }
}));