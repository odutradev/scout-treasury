import { styled } from '@mui/material/styles';
import { Box, Card as MuiCard, Paper } from '@mui/material';

export const Container = styled(Box)`
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    margin-bottom: 1.5rem;
  }
`;

export const StatsContainer = styled(Paper)`
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 8px;

  @media (max-width: 600px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

export const ActionCard = styled(MuiCard)`
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 25px -5px rgba(0,0,0,0.1), 0px 16px 32px -4px rgba(0,0,0,0.08);
  }

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

export const IconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    width: 50px;
    height: 50px;
  }
`;

export const FileInputLabel = styled('label')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  font-size: 0.875rem;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 600px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
`;