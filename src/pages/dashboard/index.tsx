import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, Schedule } from '@mui/icons-material';

import StatsCard from '@components/startsCard';
import SearchContainer from '@components/searchContainer';
import TransactionForm from '@components/transactionForm';
import TransactionList from '@components/transactionList';
import Pagination from '@components/pagination';
import Loading from '@components/loading';
import Errors from '@components/errors';
import { getAllTransactions, getTransactionSummary } from '@actions/transactions';
import usePagination from '@hooks/usePagination';
import { Container, HeaderContainer, ListContainer, PaginationContainer } from './styles';

import type { DashboardProps } from './types';
import type { TransactionRecord, TransactionSummary, TransactionFilters } from '@actions/transactions/types';

const Dashboard = ({}: DashboardProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (page: number, limit: number) => {
    const filters: TransactionFilters = {
      page,
      limit,
      pagination: true,
      ...(searchTerm && { title: searchTerm })
    };

    const allTransactions = await getAllTransactions({ ...filters, pagination: false });
    
    if ('error' in allTransactions) {
      return { error: allTransactions.error };
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = allTransactions.slice(startIndex, endIndex);
    
    const totalCount = allTransactions.length;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }, [searchTerm]);

  const { 
    data: transactions, 
    meta, 
    loading, 
    error, 
    setPage, 
    setLimit, 
    refresh 
  } = usePagination(fetchTransactions, { page: 1, limit: 10 });

  const loadSummary = async () => {
    try {
      setSummaryLoading(true);
      setSummaryError(null);
      
      const result = await getTransactionSummary();
      
      if ('error' in result) {
        setSummaryError(result.error);
        return;
      }
      
      setSummary(result);
    } catch (error) {
      setSummaryError('Erro ao carregar resumo');
      console.error('Erro ao carregar resumo:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

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

  const handleTransactionSuccess = () => {
    setModalOpen(false);
    refresh();
    loadSummary();
  };

  const handleTransactionUpdate = () => {
    refresh();
    loadSummary();
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (summaryLoading) {
    return <Loading message="Carregando dashboard" />;
  }

  if (summaryError) {
    return <Errors title="Erro" message={summaryError} />;
  }

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Entradas"
            value={formatCurrency(summary?.totalEntries || 0)}
            valueColor="success.main"
            icon={TrendingUp}
            iconColor="success"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Saídas"
            value={formatCurrency(summary?.totalExits || 0)}
            valueColor="error.main"
            icon={TrendingDown}
            iconColor="error"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Saldo"
            value={formatCurrency(summary?.balance || 0)}
            valueColor={summary && summary.balance >= 0 ? "success.main" : "error.main"}
            icon={AccountBalance}
            iconColor={summary && summary.balance >= 0 ? "success" : "error"}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Pendentes"
            value={String((summary?.pendingEntriesCount || 0) + (summary?.pendingExitsCount || 0))}
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
          disabled={loading}
        />
      </HeaderContainer>

      <ListContainer>
        {loading ? (
          <Loading message="Carregando transações" />
        ) : error ? (
          <Errors title="Erro" message={error} />
        ) : (
          <TransactionList
            transactions={transactions}
            onTransactionUpdate={handleTransactionUpdate}
          />
        )}
      </ListContainer>

      {!loading && !error && meta.totalCount > 0 && (
        <PaginationContainer>
          <Pagination
            meta={meta}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </PaginationContainer>
      )}

      <TransactionForm
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleTransactionSuccess}
      />
    </Container>
  );
};

export default Dashboard;