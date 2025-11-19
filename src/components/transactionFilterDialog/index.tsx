import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Stack
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';

import { FormContainer, FilterSection } from './styles';

import type { TransactionFilterDialogProps, FilterValues } from './types';
import type { EntryCategory, ExitCategory } from '@utils/types/models/transaction';

const TransactionFilterDialog = ({ open, onClose, onApplyFilters, currentFilters }: TransactionFilterDialogProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    completed: 'all',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    type: 'all'
  });

  useEffect(() => {
    if (currentFilters) {
      setFilters({
        category: currentFilters.category || '',
        completed: `${currentFilters.completed as boolean}` || 'all',
        minAmount: currentFilters.minAmount?.toString() || '',
        maxAmount: currentFilters.maxAmount?.toString() || '',
        startDate: currentFilters.startDate || '',
        endDate: currentFilters.endDate || '',
        type: currentFilters.type || 'all'
      });
    }
  }, [currentFilters, open]);

  const entryCategoriesOptions: { value: EntryCategory; label: string }[] = [
    { value: 'mensalidades', label: 'Mensalidades' },
    { value: 'arrecadacao', label: 'Arrecadação' },
    { value: 'doacoes', label: 'Doações' },
    { value: 'eventos', label: 'Eventos' },
    { value: 'vendas', label: 'Vendas' }
  ];

  const exitCategoriesOptions: { value: ExitCategory; label: string }[] = [
    { value: 'equipamentos', label: 'Equipamentos' },
    { value: 'manutencao', label: 'Manutenção' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'materiais', label: 'Materiais' },
    { value: 'eventos', label: 'Eventos' }
  ];

  const allCategories = [
    ...entryCategoriesOptions,
    ...exitCategoriesOptions
  ];

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    const appliedFilters: any = {};

    if (filters.category) appliedFilters.category = filters.category;
    if (filters.completed !== 'all') appliedFilters.completed = filters.completed === 'true';
    if (filters.minAmount) appliedFilters.minAmount = parseFloat(filters.minAmount);
    if (filters.maxAmount) appliedFilters.maxAmount = parseFloat(filters.maxAmount);
    if (filters.startDate) appliedFilters.startDate = filters.startDate;
    if (filters.endDate) appliedFilters.endDate = filters.endDate;
    if (filters.type !== 'all') appliedFilters.type = filters.type;

    onApplyFilters(appliedFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterValues = {
      category: '',
      completed: 'all',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      type: 'all'
    };
    setFilters(clearedFilters);
    onApplyFilters({});
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.category) count++;
    if (filters.completed !== 'all') count++;
    if (filters.minAmount) count++;
    if (filters.maxAmount) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.type !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <FilterList />
            <Typography variant="h6">Filtros</Typography>
            {activeFiltersCount > 0 && (
              <Chip 
                label={activeFiltersCount} 
                size="small" 
                color="primary"
              />
            )}
          </Box>
          {activeFiltersCount > 0 && (
            <Button 
              startIcon={<Clear />} 
              size="small" 
              onClick={handleClearFilters}
              color="error"
            >
              Limpar
            </Button>
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <FormContainer>
          <FilterSection>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tipo de Transação
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                label="Tipo"
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="entry">Entradas</MenuItem>
                <MenuItem value="exit">Saídas</MenuItem>
              </Select>
            </FormControl>
          </FilterSection>

          <FilterSection>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.completed}
                onChange={(e) => handleInputChange('completed', e.target.value)}
                label="Status"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="true">Confirmadas</MenuItem>
                <MenuItem value="false">Pendentes</MenuItem>
              </Select>
            </FormControl>
          </FilterSection>

          <FilterSection>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Categoria
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Categoria</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                label="Categoria"
              >
                <MenuItem value="">Todas</MenuItem>
                {allCategories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FilterSection>

          <FilterSection>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Valor
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Valor Mínimo"
                type="number"
                inputMode="decimal"
                value={filters.minAmount}
                onChange={(e) => handleInputChange('minAmount', e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 0.5 }}>R$</Typography>
                }}
              />
              <TextField
                label="Valor Máximo"
                type="number"
                inputMode="decimal"
                value={filters.maxAmount}
                onChange={(e) => handleInputChange('maxAmount', e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 0.5 }}>R$</Typography>
                }}
              />
            </Stack>
          </FilterSection>

          <FilterSection>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Período
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Data Inicial"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
              <TextField
                label="Data Final"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
            </Stack>
          </FilterSection>
        </FormContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button 
          onClick={handleApplyFilters} 
          variant="contained"
          startIcon={<FilterList />}
        >
          Aplicar Filtros
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionFilterDialog;