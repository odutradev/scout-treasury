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

export const SearchContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 0.5rem;
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

export const EmptyStateContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem;
  text-align: center;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;