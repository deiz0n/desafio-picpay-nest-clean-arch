export class Transaction {
  constructor(
    public payerId: string,
    public payeeId: string,
    public amount: number,
  ) {}
}
