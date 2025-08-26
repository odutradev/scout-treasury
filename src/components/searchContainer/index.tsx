import React from 'react';
import { TextField, IconButton, Button, Box } from '@mui/material';
import { Search, FilterList, Add } from '@mui/icons-material';

import { Container } from './styles';

import type { SearchContainerProps } from './types';

const SearchContainer = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Pesquisar...",
  onFilterClick,
  onAddClick,
  addButtonText = "Nova",
  showAddButton = true,
  showFilterButton = true,
  addButtonIcon = Add,
  disabled = false
}: SearchContainerProps) => {
  return (
    <Container>
      <TextField
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        variant="outlined"
        size="small"
        fullWidth
        disabled={disabled}
        InputProps={{
          startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
        }}
        sx={{ flex: 1 }}
      />
      
      {showFilterButton && (
        <IconButton 
          color="primary" 
          sx={{ ml: 1 }} 
          onClick={onFilterClick}
          disabled={disabled}
        >
          <FilterList />
        </IconButton>
      )}
      
      {showAddButton && (
        <Button
          variant="contained"
          startIcon={React.createElement(addButtonIcon)}
          sx={{ ml: 1, minWidth: { xs: 'auto', sm: '140px' } }}
          onClick={onAddClick}
          disabled={disabled}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {addButtonText}
          </Box>
        </Button>
      )}
    </Container>
  );
};

export default SearchContainer;