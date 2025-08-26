import { List } from '@mui/material';

import TransactionItem from '@components/transactionItem';
import EmptyState from '@components/emptyState';
import { Container } from './styles';

import type { TransactionListProps } from './types';

const TransactionList = ({ transactions, onTransactionUpdate }: TransactionListProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Container>
        <EmptyState
          title="Nenhuma transação encontrada"
          description="Comece adicionando sua primeira entrada ou saída"
        />
      </Container>
    );
  }

  return (
    <Container>
      <List sx={{ width: '100%' }}>
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={transaction._id}
            transaction={transaction}
            isLast={index === transactions.length - 1}
            onUpdate={onTransactionUpdate}
          />
        ))}
      </List>
    </Container>
  );
};

export default TransactionList;