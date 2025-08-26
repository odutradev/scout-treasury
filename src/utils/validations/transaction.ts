import * as yup from 'yup';

export const transactionSchema = yup.object({
  type: yup.string().oneOf(['entry', 'exit'], 'Tipo de transação inválido').required('Tipo é obrigatório'),
  title: yup
    .string()
    .required('Título é obrigatório')
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  amount: yup
    .number()
    .required('Valor é obrigatório')
    .positive('Valor deve ser positivo')
    .max(1000000, 'Valor não pode exceder R$ 1.000.000,00'),
  category: yup.string().required('Categoria é obrigatória'),
  completed: yup.boolean().required(),
  dueDate: yup.date().nullable(),
  confirmationDate: yup.date().nullable()
});