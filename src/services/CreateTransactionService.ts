import { getRepository } from 'typeorm';
import Transaction from '../models/transaction';
import Category from '../models/category';
import AppError from '../errors/AppError';

interface TransactionRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  transactionRepository = getRepository(Transaction);

  categoryRepository = getRepository(Category);

  public async execute(transaction: TransactionRequest): Promise<Transaction> {
    const categoryTitle = transaction.category;
    let category = await this.categoryRepository.findOne({
      where: { title: categoryTitle },
    });

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
