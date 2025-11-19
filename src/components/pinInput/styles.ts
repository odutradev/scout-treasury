import styled from 'styled-components';
import { Box, TextField } from '@mui/material';

export const Container = styled(Box)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  @media (max-width: 600px) {
    gap: 0.5rem;
  }
`;

export const PinDigit = styled(TextField)<{ error?: boolean }>`
  width: 60px;

  & input {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    padding: 1rem 0;
    caret-color: transparent;
  }

  & .MuiOutlinedInput-root {
    border-radius: 8px;
    
    &.Mui-focused fieldset {
      border-width: 2px;
      border-color: ${({ error, theme }) => 
        error ? theme.palette.error.main : theme.palette.primary.main};
    }
    
    & fieldset {
      border-color: ${({ error, theme }) => 
        error ? theme.palette.error.main : theme.palette.divider};
      border-width: 2px;
    }
  }

  @media (max-width: 600px) {
    width: 50px;
    
    & input {
      font-size: 1.5rem;
      padding: 0.75rem 0;
    }
  }
`;