import { sql } from 'drizzle-orm';
import { pgTable, serial, varchar, boolean,text, integer, timestamp } from 'drizzle-orm/pg-core';



export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 100 }).unique().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    password: text('password').notNull(),
    status:boolean("status").notNull().default(true),
    createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const rooms = pgTable('rooms', {
    id: serial('id').primaryKey(),
    lastMessage: text('last_message'),
    user1: integer('user1').references(() => users.id).notNull(),
    user2: integer('user2').references(() => users.id).notNull(),
    createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),


});

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    roomId: integer('room_id').references(() => rooms.id).notNull(),
    senderId: integer('sender_id').references(() => users.id).notNull(),
    receiverId: integer('receiver_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    type: text("type"),
    fileName:text("fileName").default(null),
    seen: boolean("seen").notNull().default(false),
    hrs:text("hrs"),
    createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

});









