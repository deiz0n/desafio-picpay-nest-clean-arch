import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ListTransactionsSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  payerId: z.uuid('Invalid UUID for payerId').optional(),
  payeeId: z.uuid('Invalid UUID for payeeId').optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export class ListTransactionsDto extends createZodDto(ListTransactionsSchema) {}
