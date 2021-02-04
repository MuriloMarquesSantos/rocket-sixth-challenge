import Balance from '../dtos/Balance';
import Transaction from '../models/transaction';

class GetBalanceService {
  public execute(transactions: Array<Transaction>): Balance {
    const income = transactions
      .filter(it => it.type === 'income')
      .map(it => it.value)
      .reduce((total, value) => total + value, 0);

    const outcome = transactions
      .filter(it => it.type === 'outcome')
      .map(it => it.value)
      .reduce((total, value) => total + value, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };
    return balance;
  }
}

export default GetBalanceService;
