export interface ListTransactionsQuery {
  startDate?: Date;
  endDate?: Date;
  payerId?: string;
  payeeId?: string;
  page: number;
  limit: number;
}
