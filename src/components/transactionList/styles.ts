import styled from 'styled-components';
import { Box } from '@mui/material';

export const Container = styled(Box)`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 600px) {
    border-radius: 4px;
  }
`;