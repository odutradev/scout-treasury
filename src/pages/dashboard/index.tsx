import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, Schedule } from '@mui/icons-material';

import StatsCard from '@components/startsCard';
import SearchContainer from '@components/searchContainer';
import TransactionForm from '@components/transactionForm';
import TransactionList from '@components/transactionList';
import Pagination from '@components/pagination';
import Loading from '@components/loading';
import Errors from '@components/errors';
import { getAllTransactionEntries, getAllTransactionExits, getTransactionSummary } from '@actions/transactions';
import usePagination from '@hooks/usePagination';
import useAction from '@hooks/useAction';
import { Container, HeaderContainer, ListContainer, PaginationContainer } from './styles';

import type { DashboardProps } from './types';
import type { TransactionRecord, TransactionSummary, TransactionFilters } from '@actions/transactions/types';

const Dashboard = ({}: DashboardProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const fetchTransactions = async (page: number, limit: number) => {
    const params: TransactionFilters = {
      page,
      limit,
      pagination: true,
      ...(searchValue && { title: searchValue })
    };

    const [entriesResult, exitsResult] = await Promise.all([
      getAllTransactionEntries({ ...params, limit: Math.ceil(limit / 2) }),
      getAllTransactionExits({ ...params, limit: Math.floor(limit / 2) })
    ]);

    if ('error' in entriesResult) return entriesResult;
    if ('error' in exitsResult) return exitsResult;

    const allTransactions = [
      ...entriesResult.data,
      ...exitsResult.data
    ].sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());

    const totalCount = entriesResult.pagination.totalCount + exitsResult.pagination.totalCount;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: allTransactions.slice(0, limit),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  };

  const {
    data: transactions,
    meta,
    loading,
    error,
    page,
    setPage,
    setLimit,
    refresh
  } = usePagination<TransactionRecord>(fetchTransactions, { page: 1, limit: 10 });

  const loadSummary = async () => {
    try {
      setSummaryLoading(true);
      setSummaryError(null);
      
      await useAction({
        action: () => getTransactionSummary(),
        callback: (result: TransactionSummary) => {
          setSummary(result);
        },
        onError: (error) => {
          setSummaryError(error.message);
        },
        toastMessages: {
          pending: '',
          success: '',
          error: 'Erro ao carregar resumo'
        }
      });
    } catch (error) {
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
      if (page === 1) {
        refresh();
      } else {
        setPage(1);
      }
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
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
            onTransactionUpdate={() => {
              refresh();
              loadSummary();
            }}
          />
        )}
      </ListContainer>

      {!loading && !error && meta.totalPages > 1 && (
        <PaginationContainer>
          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
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