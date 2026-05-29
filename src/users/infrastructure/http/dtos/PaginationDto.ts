import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).default(10),
});

export class PaginationDto extends createZodDto(PaginationSchema) {}
