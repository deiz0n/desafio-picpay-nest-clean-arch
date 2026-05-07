export class TransactionEntity {
  constructor(
    public readonly payerId: string,
    public readonly payeeId: string,
    public readonly amount: number,
  ) {}
}
