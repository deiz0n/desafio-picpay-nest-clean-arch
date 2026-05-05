import { integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { userModel } from '../../drizzle/schema';
import { relations } from 'drizzle-orm';

export const accountModel = pgTable('tb_account', {
  id: uuid('id').primaryKey().defaultRandom(),
  balance: integer('balance').default(0).notNull(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => userModel.id, { onDelete: 'cascade' }),
});

export const accountSchema = { accountModel };
export type AccountType = typeof accountModel.$inferInsert;

export const accountsRelations = relations(accountModel, ({ one }) => ({
  user: one(userModel, {
    fields: [accountModel.userId],
    references: [userModel.id],
  }),
}));
