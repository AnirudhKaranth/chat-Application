import { pgTable, serial, varchar, boolean,text, integer, pgEnum, primaryKey } from 'drizzle-orm/pg-core';

const messageType = pgEnum('msgType', ['file', 'text', 'img']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 100 }).unique().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    password: text('password').notNull(),
    status:text("status").notNull().default("off")
});

export const rooms = pgTable('rooms', {
    id: serial('id').primaryKey(),
    isGroup: boolean('is_group').default(false),
    lastMessage: text('last_message'),
    creatorId: integer("user_id").references(()=> users.id).notNull()
});

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    roomId: integer('room_id').references(() => rooms.id).notNull(),
    senderId: integer('sender_id').references(() => users.id).notNull(),
    receiverId: integer('receiver_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    type: text("type"), // e.g., 'file', 'img', 'text'
});


export const participants = pgTable('participants', {
    roomId: integer('room_id').references(() => rooms.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
}, (table) => ({
    pk: primaryKey(table.roomId, table.userId)
}));






