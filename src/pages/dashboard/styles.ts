import styled from 'styled-components';
import { Box } from '@mui/material';

export const Container = styled(Box)`
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const HeaderContainer = styled(Box)`
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`;

export const ListContainer = styled(Box)`
  border-radius: 4px;
  margin-bottom: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`;

export const PaginationContainer = styled(Box)`
  display: flex;
  justify-content: center;
  padding: 1rem 0 0 0;
  margin-top: auto;
`;