import { varchar } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { UserRole } from '../core/user-role.enum';
import { pgEnum } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';

const rolesValues = Object.values(UserRole) as [string, ...string[]];

export const userRoleEnum = pgEnum('user_role', rolesValues);

export const userModel = pgTable('tb_user', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: varchar('fullName').notNull(),
  email: varchar('email').notNull().unique(),
  password: varchar('password').notNull(),
  role: userRoleEnum('role').default(UserRole.CUSTOMER),
  cpf: varchar('cpf').unique(),
  cnpj: varchar('cnpj').unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});

export const userSchema = { userModel };
export type UserType = typeof userModel.$inferInsert;
