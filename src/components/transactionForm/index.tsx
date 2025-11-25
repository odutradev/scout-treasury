import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Box, Typography } from '@mui/material';

import { createTransactionEntry, createTransactionExit, updateTransaction } from '@actions/transactions';
import { transactionSchema } from '@utils/validations/transaction';
import useAction from '@hooks/useAction';

import { FormContainer, TypeSelector, AmountField } from './styles';

import type { TransactionFormProps, TransactionFormData } from './types';
import type { EntryCategory, ExitCategory } from '@utils/types/models/transaction';

const TransactionForm = ({ open, onClose, onSuccess, transaction, selectedMonth }: TransactionFormProps) => {
  const isEditMode = !!transaction;
  
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'entry',
    title: '',
    amount: 0,
    category: 'mensalidades',
    completed: false,
    dueDate: null,
    confirmationDate: null,
    createdAt: new Date()
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;

    if (transaction) {
      setFormData({
        type: transaction.data.type,
        title: transaction.data.title,
        amount: transaction.data.amount,
        category: transaction.data.category,
        completed: transaction.data.completed,
        dueDate: transaction.data.dueDate ? new Date(transaction.data.dueDate) : null,
        confirmationDate: transaction.data.confirmationDate ? new Date(transaction.data.confirmationDate) : null,
        createdAt: new Date(transaction.createdAt)
      });
    } else {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      let defaultDate: Date;

      if (selectedMonth) {
        const selectedYear = selectedMonth.getFullYear();
        const selectedMonthIndex = selectedMonth.getMonth();
        
        if (selectedYear === currentYear && selectedMonthIndex === currentMonth) {
          defaultDate = now;
        } else {
          defaultDate = new Date(selectedYear, selectedMonthIndex, 15, 12, 0, 0);
        }
      } else {
        defaultDate = now;
      }

      setFormData(prev => ({
        ...prev,
        createdAt: defaultDate
      }));
    }
  }, [transaction, selectedMonth, open]);

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

  const handleTypeChange = (type: 'entry' | 'exit') => {
    const defaultCategory = type === 'entry' ? 'mensalidades' : 'equipamentos';
    setFormData(prev => ({
      ...prev,
      type,
      category: defaultCategory
    }));
    setErrors({});
  };

  const handleInputChange = (field: keyof TransactionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateFromInput = (dateString: string): Date | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await transactionSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const validationErrors: Record<string, string> = {};
      error.inner?.forEach((err: any) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
        }
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    const transactionData = {
      ...formData,
      title: formData.title,
      amount: formData.amount,
      category: formData.category,
      completed: formData.completed,
      dueDate: formData.dueDate || undefined,
      confirmationDate: formData.completed ? formData.confirmationDate || new Date() : undefined,
      createdAt: (formData.createdAt || new Date()).toISOString(),
      type: formData.type
    };

    try {
      if (isEditMode) {
        await useAction({
          action: () => updateTransaction(transaction._id, transaction.data.type, transactionData),
          callback: (result) => {
            handleClose();
            if (onSuccess) onSuccess(result);
          },
          toastMessages: {
            pending: 'Atualizando transação...',
            success: 'Transação atualizada com sucesso!',
            error: 'Erro ao atualizar transação'
          }
        });
      } else {
        await useAction({
          action: () => formData.type === 'entry' 
            ? createTransactionEntry(transactionData) 
            : createTransactionExit(transactionData),
          callback: (result) => {
            handleClose();
            if (onSuccess) onSuccess(result);
          },
          toastMessages: {
            pending: 'Criando transação...',
            success: 'Transação criada com sucesso!',
            error: 'Erro ao criar transação'
          }
        });
      }
    } catch (error) {
      console.error('Erro ao processar transação:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      type: 'entry',
      title: '',
      amount: 0,
      category: 'mensalidades',
      completed: false,
      dueDate: null,
      confirmationDate: null,
      createdAt: new Date()
    });
    setErrors({});
    onClose();
  };

  const categoryOptions = formData.type === 'entry' ? entryCategoriesOptions : exitCategoriesOptions;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{isEditMode ? 'Editar Transação' : 'Nova Transação'}</Typography>
      </DialogTitle>
      
      <DialogContent>
        <FormContainer>
          {!isEditMode && (
            <TypeSelector>
              <Button
                variant={formData.type === 'entry' ? 'contained' : 'outlined'}
                color="success"
                onClick={() => handleTypeChange('entry')}
                fullWidth
              >
                Entrada
              </Button>
              <Button
                variant={formData.type === 'exit' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => handleTypeChange('exit')}
                fullWidth
              >
                Saída
              </Button>
            </TypeSelector>
          )}

          <TextField
            label="Título"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
          />

          <AmountField
            label="Valor"
            type="number"
            inputMode="decimal"
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            error={!!errors.amount}
            helperText={errors.amount}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>
            }}
            fullWidth
            required
          />

          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              label="Categoria"
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Data da Transação"
            type="date"
            value={formatDateForInput(formData.createdAt)}
            onChange={(e) => handleInputChange('createdAt', parseDateFromInput(e.target.value))}
            error={!!errors.createdAt}
            helperText={errors.createdAt || 'Data em que a transação ocorreu'}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Data de Vencimento"
            type="date"
            value={formatDateForInput(formData.dueDate ?? null)}
            onChange={(e) => handleInputChange('dueDate', parseDateFromInput(e.target.value))}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.completed}
                  onChange={(e) => handleInputChange('completed', e.target.checked)}
                />
              }
              label="Transação confirmada"
            />
          </Box>

          {formData.completed && (
            <TextField
              label="Data de Confirmação"
              type="date"
              value={formatDateForInput(formData.confirmationDate ?? null)}
              onChange={(e) => handleInputChange('confirmationDate', parseDateFromInput(e.target.value))}
              error={!!errors.confirmationDate}
              helperText={errors.confirmationDate}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          )}
        </FormContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          color={formData.type === 'entry' ? 'success' : 'error'}
        >
          {isEditMode ? 'Salvar Alterações' : 'Criar Transação'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;