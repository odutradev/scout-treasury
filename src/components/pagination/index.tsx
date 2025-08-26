import React from 'react';
import { FormControl, MenuItem, Typography, SelectChangeEvent } from '@mui/material';

import { Container, StyledPagination, RowsContainer, StyledSelect } from './styles';

import type { PaginationProps } from './types';

const Pagination = ({ meta, onPageChange, onLimitChange }: PaginationProps) => {
  const handlePageChange = (_e: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  const handleRowsChange = (e: SelectChangeEvent<unknown>) => {
    const newLimit = Number(e.target.value);
    onLimitChange(newLimit);
  };

  return (
    <Container>
      <StyledPagination
        count={meta.totalPages}
        page={meta.currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
      <RowsContainer>
        <Typography variant="body1" mr={1}>
          Linhas por página:
        </Typography>
        <FormControl variant="outlined" size="small">
          <StyledSelect value={meta.limit} onChange={handleRowsChange}>
            {[10, 15, 30, 50, 100].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
      </RowsContainer>
    </Container>
  );
};

export default Pagination;