import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Box, IconButton, Chip } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Schedule,
  ArrowBackIosNew,
  ArrowForwardIos,
  Assessment,
  FilterList,
} from '@mui/icons-material';

import StatsCard from '@components/startsCard';
import SearchContainer from '@components/searchContainer';
import TransactionForm from '@components/transactionForm';
import TransactionFilterDialog from '@components/transactionFilterDialog';
import TransactionList from '@components/transactionList';
import Pagination from '@components/pagination';
import Loading from '@components/loading';
import Errors from '@components/errors';
import { getAllTransactions, getMonthlyTransactionSummary } from '@actions/transactions';
import usePagination from '@hooks/usePagination';
import { Container, HeaderContainer, ListContainer, PaginationContainer, MonthIndicator } from './styles';

import type { DashboardProps } from './types';
import type { TransactionFilters, MonthlyTransactionSummary } from '@actions/transactions/types';
import type { AppliedFilters } from '@components/transactionFilterDialog/types';

const Dashboard = ({}: DashboardProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});
  const [summary, setSummary] = useState<MonthlyTransactionSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchTransactions = useCallback(
    async (page: number, limit: number) => {
      const targetYear = selectedDate.getFullYear();
      const targetMonth = selectedDate.getMonth() + 1;

      const startDate = new Date(targetYear, targetMonth - 1, 1).toISOString();
      const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999).toISOString();

      const filters: TransactionFilters = {
        page,
        limit,
        pagination: true,
        ...(searchTerm && { title: searchTerm }),
        createdAfter: startDate,
        createdBefore: endDate,
        ...appliedFilters
      };

      const allTransactions = await getAllTransactions({ ...filters, pagination: false });

      if ('error' in allTransactions) {
        return { error: allTransactions.error };
      }

      let filteredTransactions = allTransactions;

      if (appliedFilters.type) {
        filteredTransactions = filteredTransactions.filter(t => t.data.type === appliedFilters.type);
      }

      if (appliedFilters.category) {
        filteredTransactions = filteredTransactions.filter(t => t.data.category === appliedFilters.category);
      }

      if (appliedFilters.completed !== undefined) {
        filteredTransactions = filteredTransactions.filter(t => t.data.completed === appliedFilters.completed);
      }

      if (appliedFilters.minAmount !== undefined) {
        filteredTransactions = filteredTransactions.filter(t => t.data.amount >= appliedFilters.minAmount!);
      }

      if (appliedFilters.maxAmount !== undefined) {
        filteredTransactions = filteredTransactions.filter(t => t.data.amount <= appliedFilters.maxAmount!);
      }

      if (appliedFilters.startDate) {
        const filterStartDate = new Date(appliedFilters.startDate);
        filteredTransactions = filteredTransactions.filter(t => new Date(t.data.createdAt) >= filterStartDate);
      }

      if (appliedFilters.endDate) {
        const filterEndDate = new Date(appliedFilters.endDate + 'T23:59:59.999Z');
        filteredTransactions = filteredTransactions.filter(t => new Date(t.data.createdAt) <= filterEndDate);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredTransactions.slice(startIndex, endIndex);

      const totalCount = filteredTransactions.length;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: paginatedData,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    },
    [searchTerm, selectedDate, appliedFilters]
  );

  const {
    data: transactions,
    meta,
    loading,
    error,
    setPage,
    setLimit,
    refresh,
  } = usePagination(fetchTransactions, { page: 1, limit: 30 });

  const loadMonthlySummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      setSummaryError(null);

      const targetYear = selectedDate.getFullYear();
      const targetMonth = selectedDate.getMonth() + 1;

      const result = await getMonthlyTransactionSummary(targetYear, targetMonth);

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
  }, [selectedDate]);

  useEffect(() => {
    loadMonthlySummary();
  }, [loadMonthlySummary]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const handlePrevMonth = () => {
    setSelectedDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleFilterClick = () => {
    setFilterDialogOpen(true);
  };

  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = (filters: AppliedFilters) => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleClearFilter = (filterKey: keyof AppliedFilters) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[filterKey];
    setAppliedFilters(newFilters);
    setPage(1);
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
      currency: 'BRL',
    }).format(value);
  };

  const getMonthName = (month: number): string => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    return months[month - 1];
  };

  const getFilterLabel = (key: keyof AppliedFilters, value: any): string => {
    const labels: Record<string, any> = {
      type: { entry: 'Entradas', exit: 'Saídas' },
      completed: { true: 'Confirmadas', false: 'Pendentes' },
      category: value,
      minAmount: `Min: ${formatCurrency(value)}`,
      maxAmount: `Max: ${formatCurrency(value)}`,
      startDate: `De: ${new Date(value).toLocaleDateString('pt-BR')}`,
      endDate: `Até: ${new Date(value).toLocaleDateString('pt-BR')}`
    };

    if (key === 'type' || key === 'completed') {
      return labels[key][value];
    }

    return labels[key];
  };

  const getActiveFiltersCount = (): number => {
    return Object.keys(appliedFilters).length;
  };

  const monthlyBalance = (summary?.monthlyEntries || 0) - (summary?.monthlyExits || 0);

  const pendingTooltip = summary ? (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        Detalhes dos Pendentes:
      </Typography>
      <Typography variant="body2" color="success.light">
        A receber: {formatCurrency(summary.monthlyPendingEntries)}
      </Typography>
      <Typography variant="body2" color="error.light">
        A pagar: {formatCurrency(summary.monthlyPendingExits)}
      </Typography>
    </Box>
  ) : null;

  if (summaryLoading && !summary) {
    return <Loading message="Carregando dashboard" />;
  }

  if (summaryError) {
    return <Errors title="Erro" message={summaryError} />;
  }

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Container>
      <MonthIndicator>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <IconButton onClick={handlePrevMonth} size="small">
            <ArrowBackIosNew fontSize="inherit" />
          </IconButton>
          <Typography variant="h6" color="text.secondary" sx={{ mx: 2, minWidth: '180px', textAlign: 'center' }}>
            Resumo de {getMonthName(selectedDate.getMonth() + 1)} {selectedDate.getFullYear()}
          </Typography>
          <IconButton onClick={handleNextMonth} size="small">
            <ArrowForwardIos fontSize="inherit" />
          </IconButton>
        </Box>
      </MonthIndicator>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <StatsCard
            title="Entradas do Mês"
            value={formatCurrency(summary?.monthlyEntries || 0)}
            valueColor="success.main"
            icon={TrendingUp}
            iconColor="success"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 2.4 }}>
          <StatsCard
            title="Saídas do Mês"
            value={formatCurrency(summary?.monthlyExits || 0)}
            valueColor="error.main"
            icon={TrendingDown}
            iconColor="error"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 2.4 }}>
          <StatsCard
            title="Balanço do Mês"
            value={formatCurrency(monthlyBalance)}
            valueColor="primary.main"
            icon={Assessment}
            iconColor="primary"
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 2.4 }}>
          <StatsCard
            title="Saldo Total"
            value={formatCurrency(summary?.totalBalance || 0)}
            valueColor={summary && summary.totalBalance >= 0 ? 'success.main' : 'error.main'}
            icon={AccountBalance}
            iconColor={summary && summary.totalBalance >= 0 ? 'success' : 'error'}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 2.4 }}>
          <StatsCard
            title="Pendentes do Mês"
            value={String(summary?.totalPendingCount || 0)}
            valueColor="warning.main"
            icon={Schedule}
            iconColor="warning"
            tooltipContent={pendingTooltip}
          />
        </Grid>
      </Grid>

      <HeaderContainer>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h5" component="h1">
            Transações
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              icon={<FilterList />}
              label={`${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} ativo${activeFiltersCount > 1 ? 's' : ''}`}
              color="primary"
              size="small"
              onClick={handleFilterClick}
            />
          )}
        </Box>

        {activeFiltersCount > 0 && (
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {Object.entries(appliedFilters).map(([key, value]) => (
              <Chip
                key={key}
                label={getFilterLabel(key as keyof AppliedFilters, value)}
                onDelete={() => handleClearFilter(key as keyof AppliedFilters)}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}

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

      <TransactionFilterDialog
        open={filterDialogOpen}
        onClose={handleFilterDialogClose}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </Container>
  );
};

export default Dashboard;