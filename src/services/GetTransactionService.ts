import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import TransactionsResponse from '../dtos/TransactionsResponse';
import GetBalanceService from './GetBalanceService';

class GetTransactionService {
  public async execute(): Promise<TransactionsResponse> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transactions = await transactionRepository.find({
      relations: ['category'],
    });

    const getBalanceService = new GetBalanceService();

    const balance = getBalanceService.execute(transactions);

    const response = {
      transactions,
      balance,
    };

    return response;
  }
}

export default GetTransactionService;
