import { getRepository } from 'typeorm';
import Transaction from '../models/transaction';
import Category from '../models/category';
import AppError from '../errors/AppError';
import GetTransactionService from './GetTransactionService';
import TransactionRequest from '../dtos/TransactionRequest';

class CreateTransactionService {
  transactionRepository = getRepository(Transaction);

  getTransactionService = new GetTransactionService();

  categoryRepository = getRepository(Category);

  public async execute(transaction: TransactionRequest): Promise<Transaction> {
    const categoryTitle = transaction.category;
    let category = await this.categoryRepository.findOne({
      where: { title: categoryTitle },
    });

    const transactions = await this.getTransactionService.execute();

    const balance = transactions.balance.total;

    if (transaction.type === 'outcome' && balance < transaction.value) {
      throw new AppError('Insufficient funds', 400);
    }

    if (!category) {
      console.log('creating category');
      category = this.categoryRepository.create({
        title: categoryTitle,
      });

      await this.categoryRepository.save(category);
    }

    try {
      const transactionCreated = this.transactionRepository.create({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category_id: category.id,
      });

      await this.transactionRepository.save(transactionCreated);

      return transactionCreated;
    } catch (error) {
      console.error(error.message);
      throw new AppError(error);
    }
  }
}

export default CreateTransactionService;
