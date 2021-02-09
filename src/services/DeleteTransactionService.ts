import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = getCustomRepository(TransactionRepository);
    try {
      const transactionToBeRemoved = await repository.findOne(id);
      if (!transactionToBeRemoved) {
        throw new AppError('Id not found', 404);
      }
      await repository.remove(transactionToBeRemoved);
    } catch (error) {
      throw new AppError('Error deleting Transaction', 500);
    }
  }
}

export default DeleteTransactionService;
