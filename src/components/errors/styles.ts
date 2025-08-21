import { keyframes } from '@mui/system';
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: 90vh;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(20px) rotate(15deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

export const floatingIcons = [
  { top: '15%', left: '25%', size: '4rem', delay: '0s' },
  { top: '25%', right: '30%', size: '5rem', delay: '1s' },
  { bottom: '18%', left: '29%', size: '3.5rem', delay: '2s' },
  { bottom: '10%', right: '25%', size: '4.5rem', delay: '3s' },
];