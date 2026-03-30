import { mysqlTable, serial, varchar, int, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  phone_number: varchar('phone_number', { length: 12 }).notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  created_at: timestamp('created_at', {mode: 'date'}).defaultNow(),
  updated_at: timestamp('updated_at', {mode: 'date'}).defaultNow(),
});

export const schema = {
    users,
};