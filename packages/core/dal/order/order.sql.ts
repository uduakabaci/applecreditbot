import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  telegramChatId: integer('telegram_chat_id').notNull(),
  telegramUserId: integer('telegram_user_id').notNull(),
  telegramUsername: text('telegram_username'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  device: text('device', { enum: ['iPhone', 'iPad', 'Mac'] }).notNull(),
  country: text('country').notNull(),
  icloudEmail: text('icloud_email').notNull(),
  fullName: text('full_name').notNull(),
  consentGroupInvite: integer('consent_group_invite', { mode: 'boolean' }).notNull(),
  status: text('status', { enum: ['new', 'in_review', 'approved', 'rejected'] }).notNull().default('new'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
  meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;