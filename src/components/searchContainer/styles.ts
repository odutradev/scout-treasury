import styled from 'styled-components';
import { Box } from '@mui/material';

export const Container = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;