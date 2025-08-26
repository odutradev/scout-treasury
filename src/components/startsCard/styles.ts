import styled from 'styled-components';
import { Card } from '@mui/material';

export const Container = styled(Card)`
  height: 100%;
  min-height: 100px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 25px -5px rgba(0,0,0,0.1), 0px 16px 32px -4px rgba(0,0,0,0.08);
  }

  @media (max-width: 600px) {
    min-height: 80px;
  }
`;