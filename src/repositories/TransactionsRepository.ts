import { EntityRepository, Repository } from 'typeorm';
import Balance from '../dtos/Balance';

import Transaction from '../models/transaction';

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<any> {
    const transactions = await this.find({ relations: ['category'] });
    return transactions;
  }
}

export default TransactionsRepository;
