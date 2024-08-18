import jwt from "jsonwebtoken";
import {
  addMessage,
  checkIfUserIsOnline,
  getAllMyChats,
  updateUserStatus,
} from "../utils/chatUtil.js";
import { messages } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { db } from "../db/drizzle.config.js";

export const initialize = async (io) => {
  const onlineUsers = new Map();

  io.use((socket, next) => {
    const token = socket?.handshake?.auth?.token;

    if (!token) {
      return next(new Error("Authentication Error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.User = {
        userId: decoded.userId,
        userName: decoded.userName,
      };
      next();
    } catch (error) {
      return next(new Error("Authentication Error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("User connected:", socket.User);

    updateUserStatus({ userId: socket.User.userId, status: true });

    // Handle joining a room
    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`${socket.User.userName} joined room ${room}`);
    });

    // Handle receiving a message
    socket.on(
      "message",
      ({ receiverId, roomId, content, type, fileName, day, hrs }) => {
        console.log({ receiverId, roomId, content, type });

        const messageData = {
          content: content,
          senderId: socket.User.userId,
          senderName: socket.User.userName,
          roomId,
          fileName,
          type: type || "text",
          day,
          hrs,
          seen: false,
        };

        socket.to(receiverId).emit("receive-message", messageData);
        socket.to(receiverId).emit("lastMessage", { roomId, msg: content });
        if (fileName) {
          socket.emit("lastMessage", { roomId, msg: fileName });
        } else {
          socket.emit("lastMessage", { roomId, msg: content.substring(0, 15) });
        }

        addMessage({
          roomId,
          senderId: socket.User.userId,
          receiverId,
          content,
          type,
          fileName,
        });
      }
    );

    // Handle typing notifications
    socket.on("typing", (data) => {
      console.log(data);
      socket.to(data?.contactId).emit("user-typing", { roomId: data.roomId });
    });

    socket.on("stop-typing", (data) => {
      console.log("stop: ", data);
      socket.to(data?.contactId).emit("user-stoped", { roomId: data.roomId });
    });

    //check if user is online
    socket.on("check", async ({ userId }) => {
      let status = await checkIfUserIsOnline({ userId });
      socket.emit("status", status);
    });

    let allMychats = await getAllMyChats({ userId: socket.User.userId });
    allMychats.forEach((item) => {
      socket.to(item).emit("myStatus", true);
    });

    //handle seen messages
    socket.on("message-seen", async ({ roomId, contactId }) => {
      try {
        await db
          .update(messages)
          .set({ seen: true })
          .where(
            and(
              eq(messages.roomId, roomId),
              eq(messages.receiverId, socket.User.userId)
            )
          );
        socket
          .to(contactId)
          .emit("seen", { userId: socket?.User?.userId, roomId });
        socket.emit("saw", { roomId });
      } catch (error) {
        console.error("Error updating message status:", error);
      }
    });

    // Handle disconnects
    socket.on("disconnect", async () => {
      console.log("User Disconnected:", socket.User.userName);
      await updateUserStatus({ userId: socket.User.userId, status: false });

      onlineUsers.delete(socket.User.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });
};
