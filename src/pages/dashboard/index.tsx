import { Box, Grid, Typography, TextField, IconButton, Button, Pagination } from '@mui/material';
import { Search, FilterList, Add, TrendingUp, TrendingDown, AccountBalance, Schedule, Receipt } from '@mui/icons-material';

import StatsCard from '@components/startsCard';
import { Container, HeaderContainer, SearchContainer, ListContainer, PaginationContainer, EmptyStateContainer } from './styles';

import type { DashboardProps } from './types';

const Dashboard = ({}: DashboardProps) => {
  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Entradas"
            value="R$ 0,00"
            valueColor="success.main"
            icon={TrendingUp}
            iconColor="success"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Saídas"
            value="R$ 0,00"
            valueColor="error.main"
            icon={TrendingDown}
            iconColor="error"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Saldo"
            value="R$ 0,00"
            valueColor="primary.main"
            icon={AccountBalance}
            iconColor="primary"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Pendentes"
            value="0"
            valueColor="warning.main"
            icon={Schedule}
            iconColor="warning"
          />
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
          count={1} 
          page={1} 
          color="primary"
          size="small"
          showFirstButton
          showLastButton
        />
      </PaginationContainer>
    </Container>
  );
};

export default Dashboard;