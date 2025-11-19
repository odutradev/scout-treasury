import styled from 'styled-components';
import { Box, Card as MuiCard } from '@mui/material';

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: ${({ theme }) => theme.palette.background.default};

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const Card = styled(MuiCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 3rem;
  max-width: 500px;
  width: 100%;

  @media (max-width: 600px) {
    padding: 2rem;
    gap: 1.5rem;
  }
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const RoleBadge = styled(Box)`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${({ theme }) => theme.palette.primary.main};
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;