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
import { getAllTransactions, getTransactionSummary } from '@actions/transactions';
import useAction from '@hooks/useAction';
import { Container, HeaderContainer, ListContainer, PaginationContainer } from './styles';

import type { DashboardProps } from './types';
import type { TransactionRecord, TransactionSummary, TransactionFilters } from '@actions/transactions/types';
import type { PaginationMeta } from '@utils/types/action';

const Dashboard = ({}: DashboardProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false
  });

  const loadTransactions = async (page: number = meta.currentPage, limit: number = meta.limit) => {
    setLoading(true);
    setError(null);

    const filters: TransactionFilters = {
      page,
      limit,
      pagination: false,
      ...(searchValue && { title: searchValue })
    };

    try {
      await useAction({
        action: () => getAllTransactions(filters),
        callback: (result: TransactionRecord[]) => {
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedData = result.slice(startIndex, endIndex);
          
          const totalCount = result.length;
          const totalPages = Math.ceil(totalCount / limit);

          setTransactions(paginatedData);
          setMeta({
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
          });
        },
        onError: (error) => {
          setTransactions([]);
          setError(error.message);
        },
        toastMessages: {
          pending: '',
          success: '',
          error: 'Erro ao carregar transações'
        }
      });
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

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
    loadTransactions(1, 10);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadTransactions(1, meta.limit);
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
    loadTransactions(meta.currentPage, meta.limit);
    loadSummary();
  };

  const handlePageChange = (newPage: number) => {
    loadTransactions(newPage, meta.limit);
  };

  const handleLimitChange = (newLimit: number) => {
    loadTransactions(1, newLimit);
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
              loadTransactions(meta.currentPage, meta.limit);
              loadSummary();
            }}
          />
        )}
      </ListContainer>

      {!loading && !error && meta.totalCount > 0 && (
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