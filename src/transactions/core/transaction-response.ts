export class TransactionResponse {
  constructor(
    public readonly id: string,
    public payerId: string,
    public payeeId: string,
    public amount: number,
    public createdAt: Date | null,
  ) {}
}
