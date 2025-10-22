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
import { getAllTransactions, getMonthlyTransactionSummary } from '@actions/transactions';
import usePagination from '@hooks/usePagination';
import { Container, HeaderContainer, ListContainer, PaginationContainer, MonthIndicator } from './styles';

import type { DashboardProps } from './types';
import type {TransactionFilters, MonthlyTransactionSummary } from '@actions/transactions/types';

const Dashboard = ({}: DashboardProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [summary, setSummary] = useState<MonthlyTransactionSummary | null>(null);
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

  const loadMonthlySummary = async () => {
    try {
      setSummaryLoading(true);
      setSummaryError(null);
      
      const result = await getMonthlyTransactionSummary();
      
      if ('error' in result) {
        setSummaryError(result.error);
        return;
      }
      
      setSummary(result);
    } catch (error) {
      setSummaryError('Erro ao carregar resumo mensal');
      console.error('Erro ao carregar resumo mensal:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    loadMonthlySummary();
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
    loadMonthlySummary();
  };

  const handleTransactionUpdate = () => {
    refresh();
    loadMonthlySummary();
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getMonthName = (month: number): string => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  if (summaryLoading) {
    return <Loading message="Carregando dashboard" />;
  }

  if (summaryError) {
    return <Errors title="Erro" message={summaryError} />;
  }

  return (
    <Container>
      {summary && (
        <MonthIndicator>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Resumo de {getMonthName(summary.month)} {summary.year}
          </Typography>
        </MonthIndicator>
      )}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Entradas do Mês"
            value={formatCurrency(summary?.monthlyEntries || 0)}
            valueColor="success.main"
            icon={TrendingUp}
            iconColor="success"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Saídas do Mês"
            value={formatCurrency(summary?.monthlyExits || 0)}
            valueColor="error.main"
            icon={TrendingDown}
            iconColor="error"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Saldo Total"
            value={formatCurrency(summary?.totalBalance || 0)}
            valueColor={summary && summary.totalBalance >= 0 ? "success.main" : "error.main"}
            icon={AccountBalance}
            iconColor={summary && summary.totalBalance >= 0 ? "success" : "error"}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Pendentes do Mês"
            value={String(summary?.totalPendingCount || 0)}
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