import Balance from './balance';
import Transaction from '../models/transaction';

interface TransactionsResponse {
  transactions: Array<Transaction>;
  balance: Balance;
}

export default TransactionsResponse;
