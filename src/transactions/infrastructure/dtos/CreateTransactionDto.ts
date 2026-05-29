import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateTransactionSchema = z.object({
  payerId: z.uuid('Invalid UUID').nonempty('payerId is required'),
  payeeId: z.uuid('Invalid UUID').nonempty('payeeId is required'),
  amount: z
    .number()
    .positive('The value is positive or greater than 0s')
    .transform((vol) => Math.round(vol * 100)),
});

export class CreateTransactionDto extends createZodDto(
  CreateTransactionSchema,
) {}
