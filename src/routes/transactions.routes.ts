import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import GetTransactionService from '../services/GetTransactionService';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

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
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
