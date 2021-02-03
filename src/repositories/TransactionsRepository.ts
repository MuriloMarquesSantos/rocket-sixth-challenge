import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
  }
}

export default TransactionsRepository;
