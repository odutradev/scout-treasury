import React, { useState } from 'react';
import { ListItem, ListItemText, Typography, IconButton, Menu, MenuItem, Box, Collapse } from '@mui/material';
import { MoreVert, TrendingUp, TrendingDown, CheckCircle, Schedule, Edit, ExpandMore, ExpandLess } from '@mui/icons-material';

import { markTransactionAsCompleted, markTransactionAsPending, deleteTransaction } from '@actions/transactions';
import useAuthStore from '@stores/auth';
import useAction from '@hooks/useAction';
import { Container, ContentContainer, AmountContainer, CategoryChip, StatusIcon, DescriptionContainer, ExpandButton } from './styles';

import type { TransactionItemProps } from './types';

const TransactionItem = ({ transaction, isLast, onUpdate, onEdit }: TransactionItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { canEdit } = useAuthStore();
  const isEntry = transaction.data.type === 'entry';
  const isCompleted = transaction.data.completed;
  const hasDescription = !!transaction.data.description;
  const DESCRIPTION_LIMIT = 80;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      mensalidades: 'Mensalidades',
      arrecadacao: 'Arrecadação',
      doacoes: 'Doações',
      eventos: 'Eventos',
      vendas: 'Vendas',
      equipamentos: 'Equipamentos',
      manutencao: 'Manutenção',
      transporte: 'Transporte',
      materiais: 'Materiais'
    };
    return labels[category] || category;
  };

  const getTruncatedDescription = (text: string): string => {
    if (text.length <= DESCRIPTION_LIMIT) return text;
    return text.substring(0, DESCRIPTION_LIMIT) + '...';
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit(transaction);
    }
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleToggleStatus = async () => {
    setLoading(true);
    handleMenuClose();

    try {
      const action = isCompleted 
        ? () => markTransactionAsPending(transaction._id, transaction.data.type)
        : () => markTransactionAsCompleted(transaction._id, transaction.data.type);

      await useAction({
        action,
        callback: () => {
          onUpdate();
        },
        toastMessages: {
          pending: isCompleted ? 'Marcando como pendente...' : 'Confirmando transação...',
          success: isCompleted ? 'Transação marcada como pendente' : 'Transação confirmada',
          error: 'Erro ao atualizar transação'
        }
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    handleMenuClose();

    try {
      await useAction({
        action: () => deleteTransaction(transaction._id, transaction.data.type),
        callback: () => {
          onUpdate();
        },
        toastMessages: {
          pending: 'Excluindo transação...',
          success: 'Transação excluída com sucesso',
          error: 'Erro ao excluir transação'
        }
      });
    } catch (error) {
      console.error('Erro ao excluir:', error);
    } finally {
      setLoading(false);
    }
  };

  const needsTruncation = hasDescription && transaction.data.description!.length > DESCRIPTION_LIMIT;

  return (
    <Container divider={!isLast} aria-disabled={loading}>
      <ListItem
        sx={{ 
          px: { xs: 2, sm: 3 }, 
          py: { xs: 1.5, sm: 2 },
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >
        <Box display="flex" alignItems="flex-start" width="100%">
          <StatusIcon>
            {isEntry ? (
              <TrendingUp color="success" />
            ) : (
              <TrendingDown color="error" />
            )}
          </StatusIcon>

          <ContentContainer onClick={hasDescription ? handleToggleExpand : undefined} sx={{ cursor: hasDescription ? 'pointer' : 'default' }}>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography variant="body1" fontWeight={500}>
                    {transaction.data.title}
                  </Typography>
                  <CategoryChip 
                    label={getCategoryLabel(transaction.data.category)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box mt={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Criado em: {formatDate(transaction.createdAt)}
                  </Typography>
                  {transaction.data.dueDate && (
                    <Typography variant="body2" color="text.secondary">
                      Vencimento: {formatDate(transaction.data.dueDate)}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ContentContainer>

          <AmountContainer>
            <Typography 
              variant="h6" 
              color={isEntry ? "success.main" : "error.main"}
              fontWeight={600}
            >
              {isEntry ? '+' : '-'}{formatCurrency(transaction.data.amount)}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
              {isCompleted ? (
                <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <Schedule sx={{ fontSize: 16, color: 'warning.main' }} />
              )}
              <Typography variant="caption" color="text.secondary">
                {isCompleted ? 'Confirmada' : 'Pendente'}
              </Typography>
            </Box>
          </AmountContainer>

          {canEdit() && (
            <IconButton 
              onClick={handleMenuOpen}
              disabled={loading}
              size="small"
            >
              <MoreVert />
            </IconButton>
          )}
        </Box>

        {hasDescription && (
          <Box width="100%" mt={1}>
            <DescriptionContainer>
              <Collapse in={expanded || !needsTruncation} collapsedSize={0}>
                <Typography variant="body2" color="text.secondary">
                  {transaction.data.description}
                </Typography>
              </Collapse>
              {!expanded && needsTruncation && (
                <Typography variant="body2" color="text.secondary">
                  {getTruncatedDescription(transaction.data.description!)}
                </Typography>
              )}
              {needsTruncation && (
                <ExpandButton
                  size="small"
                  onClick={handleToggleExpand}
                >
                  {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </ExpandButton>
              )}
            </DescriptionContainer>
          </Box>
        )}

        {canEdit() && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleEdit}>
              <Edit sx={{ mr: 1, fontSize: 18 }} />
              Editar
            </MenuItem>
            <MenuItem onClick={handleToggleStatus}>
              {isCompleted ? 'Marcar como Pendente' : 'Confirmar Transação'}
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              Excluir
            </MenuItem>
          </Menu>
        )}
      </ListItem>
    </Container>
  );
};

export default TransactionItem;