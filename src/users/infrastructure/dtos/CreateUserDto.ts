import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserRole } from '../../core/user-role.enum';

const CreateUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(UserRole),
  cpf: z
    .string()
    .max(11, 'CPF must have a maximum of 11 characters')
    .optional(),
  cnpj: z
    .string()
    .max(14, 'CNPJ must have a maximum of 14 characters')
    .optional(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
