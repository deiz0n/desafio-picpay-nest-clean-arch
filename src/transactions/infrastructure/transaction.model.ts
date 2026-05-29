import { relations } from 'drizzle-orm';
import { integer } from 'drizzle-orm/pg-core';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userModel } from '../../drizzle/schema';

export const transactionModel = pgTable('tb_transaction', {
  id: uuid('id').primaryKey().defaultRandom(),
  payerId: uuid('payer_id')
    .notNull()
    .references(() => userModel.id),
  payeeId: uuid('payee_id')
    .notNull()
    .references(() => userModel.id),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});

export const transactionSchema = { transactionModel };
export type TransactionType = typeof transactionModel.$inferInsert;

export const transactionsRelations = relations(transactionModel, ({ one }) => ({
  payer: one(userModel, {
    fields: [transactionModel.payerId],
    references: [userModel.id],
    relationName: 'payer_transactions',
  }),
  payee: one(userModel, {
    fields: [transactionModel.payeeId],
    references: [userModel.id],
    relationName: 'payee_transactions',
  }),
}));
