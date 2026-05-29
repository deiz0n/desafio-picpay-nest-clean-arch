export class Payload {
  constructor(
    public userId: string | undefined,
    public email: string,
    public role: string | null | undefined,
  ) {}
}
