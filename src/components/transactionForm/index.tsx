import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Box, Typography } from '@mui/material';

import { createTransactionEntry, createTransactionExit } from '@actions/transactions';
import { transactionSchema } from '@utils/validations/transaction';
import useAction from '@hooks/useAction';

import { FormContainer, TypeSelector, AmountField } from './styles';

import type { TransactionFormProps, TransactionFormData } from './types';
import type { EntryCategory, ExitCategory } from '@utils/types/models/transaction';

const TransactionForm = ({ open, onClose, onSuccess }: TransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'entry',
    title: '',
    amount: 0,
    category: 'mensalidades',
    completed: false,
    dueDate: null,
    confirmationDate: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    return date.toISOString().split('T')[0];
  };

  const parseDateFromInput = (dateString: string): Date | null => {
    if (!dateString) return null;
    return new Date(dateString + 'T00:00:00.000Z');
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
      title: formData.title,
      amount: formData.amount,
      category: formData.category,
      completed: formData.completed,
      dueDate: formData.dueDate || undefined,
      confirmationDate: formData.completed ? formData.confirmationDate || new Date() : undefined
    };

    try {
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
    } catch (error) {
      console.error('Erro ao criar transação:', error);
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
      confirmationDate: null
    });
    setErrors({});
    onClose();
  };

  const categoryOptions = formData.type === 'entry' ? entryCategoriesOptions : exitCategoriesOptions;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Nova Transação</Typography>
      </DialogTitle>
      
      <DialogContent>
        <FormContainer>
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
            label="Data de Vencimento"
            type="date"
            value={formatDateForInput(formData.dueDate)}
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
              value={formatDateForInput(formData.confirmationDate)}
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
          Criar Transação
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;