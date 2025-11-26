import { styled } from '@mui/material/styles';
import { ListItem, Box, Chip, IconButton } from '@mui/material';

export const Container = styled(ListItem)`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }

  @media (max-width: 600px) {
    padding: 0 !important;
  }
`;

export const StatusIcon = styled(Box)`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  @media (max-width: 600px) {
    margin-right: 0.75rem;
  }
`;

export const ContentContainer = styled(Box)`
  flex: 1;
  min-width: 0;
  margin-right: 1rem;

  @media (max-width: 600px) {
    margin-right: 0.5rem;
  }
`;

export const AmountContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 0.5rem;
  min-width: 120px;

  @media (max-width: 600px) {
    min-width: 100px;
    margin-right: 0.25rem;
  }
`;

export const CategoryChip = styled(Chip)`
  height: 20px;
  font-size: 0.7rem;

  @media (max-width: 600px) {
    height: 18px;
    font-size: 0.65rem;
  }
`;

export const DescriptionContainer = styled(Box)`
  background: ${({ theme }) => theme.palette.action.hover};
  border-radius: 4px;
  padding: 0.75rem;
  position: relative;

  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;

export const ExpandButton = styled(IconButton)`
  position: absolute;
  right: 0.25rem;
  bottom: 0.25rem;
  padding: 0.25rem;
  background: ${({ theme }) => theme.palette.background.paper};
  
  &:hover {
    background: ${({ theme }) => theme.palette.action.selected};
  }

  @media (max-width: 600px) {
    right: 0.125rem;
    bottom: 0.125rem;
  }
`;