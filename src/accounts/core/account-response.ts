export class AccountResponse {
  constructor(
    public readonly id: string,
    public balance: number,
    public userId: string,
  ) {}
}
