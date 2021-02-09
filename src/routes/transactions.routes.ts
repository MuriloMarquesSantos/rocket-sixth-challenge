import { Router } from 'express';

import multer from 'multer';
import path from 'path';
import uploadConfig from '../config/uploadConfig';

import TransactionsRepository from '../repositories/TransactionsRepository';
import GetTransactionService from '../services/GetTransactionService';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const getTransactionService = new GetTransactionService();
  const result = await getTransactionService.execute();
  return response.status(200).json(result);
});

transactionsRouter.post('/', async (request, response) => {
  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute(request.body);
  console.log(transaction.category);

  return response.status(201).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute(request.params.id);

  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('transactions'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();
    const importResponse = await importTransactionsService.execute();
    return response.status(201).json(importResponse);
  },
);

export default transactionsRouter;
