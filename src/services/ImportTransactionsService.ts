import csv from 'csv-parse';
import fs from 'fs';
import { getRepository, In, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import CreateTransactionService from './CreateTransactionService';
import TransactionRequest from '../dtos/TransactionRequest';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  async execute(filePath: string): Promise<any> {
    let transactions: TransactionRequest[];
    try {
      transactions = await this.readCsv(filePath);
    } catch (error) {
      throw new AppError(error.message, 500);
    }
    return transactions;
  }

  async readCsv(filePath: string): Promise<any> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const readStream = fs.createReadStream(filePath);

    const parseStream = csv({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readStream.pipe(parseStream);

    const transactions: TransactionRequest[] = [];
    const categories: string[] = [];
    parseCSV.on('data', line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    return { categories, transactions };
  }

  async createTransactions(transactionsRequest: any): Promise<Transaction[]> {
    const transactionsResponse: Transaction[] = [];
    const createTransactionsService = new CreateTransactionService();

    transactionsRequest.transactions.forEach(
      async (transaction: TransactionRequest) => {
        const transactionResponse = await createTransactionsService.execute(
          transaction,
        );
        transactionsResponse.push(transactionResponse);
      },
    );
    return transactionsResponse;
  }
}

export default ImportTransactionsService;
