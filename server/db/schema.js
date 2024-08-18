import { pgTable, serial, varchar, boolean,text, integer, pgEnum, primaryKey, timestamp } from 'drizzle-orm/pg-core';

const messageType = pgEnum('msgType', ['file', 'text', 'img']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 100 }).unique().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    password: text('password').notNull(),
    status:boolean("status").notNull().default(true),
    createdAt: integer('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const rooms = pgTable('rooms', {
    id: serial('id').primaryKey(),
    lastMessage: text('last_message'),
    user1: integer('user1').references(() => users.id).notNull(),
    user2: integer('user2').references(() => users.id).notNull(),
    createdAt: integer('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),


});

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    roomId: integer('room_id').references(() => rooms.id).notNull(),
    senderId: integer('sender_id').references(() => users.id).notNull(),
    receiverId: integer('receiver_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    type: text("type"), // e.g., 'file', 'img', 'text'
    seen: boolean("seen").notNull().default(false),
    createdAt: integer('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

});









