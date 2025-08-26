import styled from 'styled-components';
import { Box } from '@mui/material';

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem;
  text-align: center;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;