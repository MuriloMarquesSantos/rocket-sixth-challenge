import Balance from './balance';
import Transaction from '../models/Transaction';

interface TransactionsResponse {
  transactions: Array<Transaction>;
  balance: Balance;
}

export default TransactionsResponse;
