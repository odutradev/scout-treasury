import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

export const Container = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  justify-content: center;

  @media (max-width: 600px) {
    gap: 0.5rem;
  }
`;

export const Input = styled(TextField)<{ error?: boolean }>`
  width: 60px;

  & .MuiInputBase-root {
    height: 60px;
  }

  & input {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    padding: 0;
    caret-color: ${({ theme }) => theme.palette.primary.main};
  }

  & .MuiOutlinedInput-root {
    border-radius: 12px;
    transition: all 0.2s;

    &:hover fieldset {
      border-color: ${({ theme }) => theme.palette.primary.main};
    }

    &.Mui-focused fieldset {
      border-width: 2px;
      border-color: ${({ theme }) => theme.palette.primary.main};
    }

    ${({ error, theme }) =>
      error &&
      `
      fieldset {
        border-color: ${theme.palette.error.main} !important;
      }
    `}
  }

  @media (max-width: 600px) {
    width: 50px;

    & .MuiInputBase-root {
      height: 50px;
    }

    & input {
      font-size: 1.25rem;
    }
  }
`;

export const ToggleButton = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
`;