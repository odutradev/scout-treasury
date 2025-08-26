import { useState } from 'react';
import { Box, Grid, CardContent, Typography, TextField, IconButton, Button } from '@mui/material';
import { Search, FilterList, Add, TrendingUp, TrendingDown, AccountBalance, Schedule, Receipt } from '@mui/icons-material';

import Pagination from '@components/pagination';
import { Container, StatsCard, HeaderContainer, SearchContainer, ListContainer, PaginationContainer, EmptyStateContainer } from './styles';

import type { DashboardProps } from './types';
import type { PaginationMeta } from '@utils/types/action';

const Dashboard = ({}: DashboardProps) => {
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNext: false,
    hasPrev: false
  });

  const handlePageChange = (page: number) => {
    setPaginationMeta(prev => ({
      ...prev,
      currentPage: page,
      hasPrev: page > 1,
      hasNext: page < prev.totalPages
    }));
  };

  const handleLimitChange = (limit: number) => {
    const totalPages = Math.ceil(paginationMeta.totalCount / limit);
    const currentPage = Math.min(paginationMeta.currentPage, totalPages);
    
    setPaginationMeta(prev => ({
      ...prev,
      limit,
      totalPages,
      currentPage,
      hasPrev: currentPage > 1,
      hasNext: currentPage < totalPages
    }));
  };

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Entradas
                  </Typography>
                  <Typography variant="h6" component="div" color="success.main">
                    R$ 0,00
                  </Typography>
                </Box>
                <TrendingUp color="success" />
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Saídas
                  </Typography>
                  <Typography variant="h6" component="div" color="error.main">
                    R$ 0,00
                  </Typography>
                </Box>
                <TrendingDown color="error" />
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Saldo
                  </Typography>
                  <Typography variant="h6" component="div" color="primary.main">
                    R$ 0,00
                  </Typography>
                </Box>
                <AccountBalance color="primary" />
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pendentes
                  </Typography>
                  <Typography variant="h6" component="div" color="warning.main">
                    0
                  </Typography>
                </Box>
                <Schedule color="warning" />
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      <HeaderContainer>
        <Typography variant="h5" component="h1" gutterBottom>
          Transações
        </Typography>

        <SearchContainer>
          <TextField
            placeholder="Pesquisar transações..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
            sx={{ flex: 1 }}
          />
          <IconButton color="primary" sx={{ ml: 1 }}>
            <FilterList />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ ml: 1, minWidth: { xs: 'auto', sm: '140px' } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Nova
            </Box>
          </Button>
        </SearchContainer>
      </HeaderContainer>

      <ListContainer>
        <EmptyStateContainer>
          <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma transação encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comece adicionando sua primeira entrada ou saída
          </Typography>
        </EmptyStateContainer>
      </ListContainer>

      <PaginationContainer>
        <Pagination 
          meta={paginationMeta}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </PaginationContainer>
    </Container>
  );
};

export default Dashboard;