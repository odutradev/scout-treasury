import React, { useState } from 'react';
import { Grid, Typography, Pagination } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, Schedule, Receipt } from '@mui/icons-material';

import StatsCard from '@components/startsCard';
import SearchContainer from '@components/searchContainer';
import TransactionForm from '@components/transactionForm';
import EmptyState from '@components/emptyState';
import { Container, HeaderContainer, ListContainer, PaginationContainer } from './styles';

import type { DashboardProps } from './types';

const Dashboard = ({}: DashboardProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleFilterClick = () => {
    console.log('Filter clicked');
  };

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleTransactionSuccess = (_result: any) => {
    setModalOpen(false);
  };

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

        <SearchContainer
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Pesquisar transações..."
          onFilterClick={handleFilterClick}
          onAddClick={handleAddClick}
          addButtonText="Nova"
        />
      </HeaderContainer>

      <ListContainer>
        <EmptyState
          icon={Receipt}
          title="Nenhuma transação encontrada"
          description="Comece adicionando sua primeira entrada ou saída"
        />
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

      <TransactionForm
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleTransactionSuccess}
      />
    </Container>
  );
};

export default Dashboard;