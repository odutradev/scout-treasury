import { styled } from '@mui/material/styles';
import { Box, Card as MuiCard } from '@mui/material';

export const Container = styled(Box)`
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;

  @media (max-width: 600px) {
    padding: 0.75rem;
  }
`;

export const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
    margin-bottom: 1rem;
  }
`;

export const ActionCard = styled(MuiCard)`
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 600px) {
    padding: 0.75rem;
  }
`;

export const FileInputLabel = styled('label')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  font-weight: 500;
  font-size: 0.875rem;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.main};
  background: transparent;

  &:hover {
    opacity: 0.8;
    background: ${({ theme }) => theme.palette.action.hover};
  }

  @media (max-width: 600px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
`;