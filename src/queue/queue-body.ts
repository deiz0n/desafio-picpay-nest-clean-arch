export class QueueBody {
  constructor(
    public readonly payeeName: string,
    public readonly valueTransaction: number,
    public readonly email: string,
  ) {}
}
