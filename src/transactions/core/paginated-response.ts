export class PaginatedResponse<T> {
  constructor(
    public readonly items: T[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
    public readonly totalPages: number,
  ) {}

  static create<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    return new PaginatedResponse(items, total, page, limit, totalPages);
  }
}
