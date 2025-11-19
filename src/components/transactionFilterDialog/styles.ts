import styled from 'styled-components';
import { Box } from '@mui/material';

export const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
  min-height: 300px;

  @media (max-width: 600px) {
    gap: 1rem;
    min-height: 250px;
  }
`;

export const FilterSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;