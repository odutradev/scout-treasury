import styled from 'styled-components';
import { Box, TextField } from '@mui/material';

export const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
  min-height: 400px;

  @media (max-width: 600px) {
    gap: 1rem;
    min-height: 350px;
  }
`;

export const TypeSelector = styled(Box)`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;

  @media (max-width: 600px) {
    gap: 0.5rem;
    flex-direction: column;
  }
`;

export const AmountField = styled(TextField)`
  .MuiInputBase-input {
    font-weight: 500;
    font-size: 1.1rem;
  }

  .MuiInputBase-root {
    padding-left: 8px;
  }

  @media (max-width: 600px) {
    .MuiInputBase-input {
      font-size: 1rem;
    }
  }
`;