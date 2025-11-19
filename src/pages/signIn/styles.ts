import styled from 'styled-components';
import { Box, keyframes } from '@mui/material';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

export const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 3rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.palette.background.paper};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
  max-width: 500px;
  width: 100%;

  @media (max-width: 600px) {
    padding: 2rem;
    gap: 1.5rem;
  }
`;

export const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.palette.primary.main}, ${({ theme }) => theme.palette.secondary.main});
  box-shadow: 0 4px 12px rgba(4, 153, 200, 0.3);

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;