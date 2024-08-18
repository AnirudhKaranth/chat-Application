import { and, eq, or } from "drizzle-orm";
import { db } from "../db/drizzle.config.js";
import { messages, rooms, users } from "../db/schema.js";

export const getNoOfUnseenMesssagesByChatId = async (chatId, userId) => {
  let NoOfMessagesRes = await db
    .select({
      count: count(),
    })
    .from(messages)
    .where(
      and(
        and(eq(messages.roomId, chatId), eq(messages.receiverId, userId)),
        eq(messages.seen, false)
      )
    )
    .groupBy(messages.roomId);
  let NoOfMessages = NoOfMessagesRes[0]?.count || 0;

  return NoOfMessages;
};

export const addMessage = async ({
  roomId,
  senderId,
  receiverId,
  content,
  type,
  fileName,
}) => {
  try {
    const msg = await db
      .insert(messages)
      .values({ roomId, senderId, receiverId, fileName, content, type })
      .returning();
    if (fileName) {
      await db
        .update(rooms)
        .set({ lastMessage: msg[0]?.fileName?.substring(0, 15) })
        .where(eq(rooms.id, roomId));
    } else {
      await db
        .update(rooms)
        .set({ lastMessage: msg[0]?.content?.substring(0, 15) })
        .where(eq(rooms.id, roomId));
    }

    return 0;
  } catch (error) {
    console.log(error);
    return 1;
  }
};

export const checkIfUserIsOnline = async ({ userId }) => {
  try {
    const status = await db.select().from(users).where(eq(users.id, userId));
    return status[0].status;
  } catch (error) {
    console.log(error);
    return 1;
  }
};

export const updateUserStatus = async ({ userId, status }) => {
  try {
    await db
      .update(users)
      .set({ status: status })
      .where(eq(users.id, userId))
      .returning();
    return 0;
  } catch (error) {
    console.log(error);
    return 1;
  }
};

export const getAllMyChats = async ({ userId }) => {
  try {
    const chats = await db
      .select()
      .from(rooms)
      .where(or(eq(rooms.user1, userId), eq(rooms.user2, userId)));
    let allChats = await Promise.all(
      chats.map(async (item) => {
        let contactId = item.user1 === userId ? item.user2 : item.user1;
        return contactId;
      })
    );

    return allChats;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
