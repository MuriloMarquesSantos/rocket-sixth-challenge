import { getCustomRepository } from 'typeorm';
import Transaction from '../models/transaction';
import Category from '../models/category';
import AppError from '../errors/AppError';
import GetTransactionService from './GetTransactionService';
import TransactionRequest from '../dtos/TransactionRequest';
import TransactionsRepository from '../repositories/TransactionsRepository';

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionRequest): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = transactionRepository.create({
      title,
      value,
      type,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
