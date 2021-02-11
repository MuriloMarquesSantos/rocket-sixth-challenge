import path from 'path';
import csv from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/transaction';
import AppError from '../errors/AppError';
import CreateTransactionService from './CreateTransactionService';
import TransactionRequest from '../dtos/TransactionRequest';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    let transactions: TransactionRequest[];
    let createdTransactions;
    try {
      transactions = await this.readCsv();
      createdTransactions = await this.createTransactions(transactions);
    } catch (error) {
      throw new AppError(error.message, 500);
    }
    return createdTransactions;
  }

  async readCsv(): Promise<TransactionRequest[]> {
    const tmpFolder = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      'transactions',
    );
    const readStream = fs.createReadStream(tmpFolder);

    const parseStream = csv({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readStream.pipe(parseStream);

    const array: TransactionRequest[] = [];
    parseCSV.on('data', line => {
      const request = {
        title: line[0],
        type: line[1],
        value: line[2],
        category: line[3],
      };
      array.push(request);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });
    return array;
  }

  async createTransactions(
    transactions: TransactionRequest[],
  ): Promise<Transaction[]> {
    const transactionsResponse: Transaction[] = [];
    const createTransactionsService = new CreateTransactionService();

    transactions.forEach(async transaction => {
      const transactionResponse = await createTransactionsService.execute(
        transaction,
      );
      transactionsResponse.push(transactionResponse);
    });
    return transactionsResponse;
  }
}

export default ImportTransactionsService;
