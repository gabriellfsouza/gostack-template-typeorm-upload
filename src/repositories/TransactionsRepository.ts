import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const sum = (accum: number, current: number): number => accum + current;
    const [incomeResult, outcomeResult] = await Promise.all([
      this.find({ where: { type: 'income' } }),
      this.find({ where: { type: 'outcome' } }),
    ]);
    const income = incomeResult.map(i => i.value).reduce(sum, 0);
    const outcome = outcomeResult.map(i => i.value).reduce(sum, 0);
    const total = income - outcome;
    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
