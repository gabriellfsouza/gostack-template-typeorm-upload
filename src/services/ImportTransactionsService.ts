import csv from 'csv-parse';
import { promises } from 'fs';
// import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from './CreateTransactionService';

interface Row {
  title: string;
  type: 'income' | 'outcome';
  value: string;
  category: string;
}

class ImportTransactionsService {
  async execute(file: Express.Multer.File): Promise<Transaction[]> {
    // const transactionsRepository = getCustomRepository(TransactionsRepository);
    // const queryRunner = transactionsRepository.manager.connection.createQueryRunner();

    // await queryRunner.startTransaction();

    const createTransaction = new CreateTransactionService();
    // try {
    const str = await promises.readFile(file.path);
    await promises.unlink(file.path);

    const result: Row[] = await new Promise((resolve, reject) => {
      csv(
        str,
        {
          trim: true,
          skip_empty_lines: true,
          from_line: 2,
          columns: ['title', 'type', 'value', 'category'],
        },
        (err, data: Row[]) => {
          if (err) return reject(err);
          return resolve(data);
        },
      );
    });

    const transactions = [];

    for (let i = 0; i < result.length; i += 1) {
      const { title, type, category, value } = result[i];
      const transaction = await createTransaction.execute({
        title,
        category,
        type,
        value: Number(value),
      });
      transactions.push(transaction);
    }

    // await queryRunner.commitTransaction();
    return transactions;
    // } catch (error) {
    //   // await queryRunner.rollbackTransaction();
    //   throw error;
    // }
  }
}

export default ImportTransactionsService;
