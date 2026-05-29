import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserRole } from '../../core/user-role.enum';

const UpdateUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  email: z.email('Invalid email address').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
  role: z.enum(UserRole).optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
