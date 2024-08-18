import jwt from "jsonwebtoken";
import { getOlderMessages } from "../controllers/chatController.js";
import { addMessage } from "../utils/chatUtil.js";

export const initialize = async (io) => {
  const onlineUsers = new Map();

  // Middleware for token-based authentication
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

  io.on("connection", (socket) => {
    console.log("User connected:", socket.User);

    // Add the user to the online users map
    onlineUsers.set(socket.User.userId, socket.id);

    // Notify others of the current online users
    io.emit("online-users", Array.from(onlineUsers.keys()));

    // Handle joining a room
    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`${socket.User.userName} joined room ${room}`);
    });

    // Handle receiving a message
    socket.on("message", ({ receiverId, roomId, content, type, day, hrs }) => {
      console.log({ receiverId, room, message, type });
      
      const messageData = {
        content: content,
        senderId: socket.User.userId,
        senderName: socket.User.userName,
        roomId,
        type: type || "text", // Default to "text" if no type is provided
       day,
       hrs,
       seen:false
      };
      
      // Emit message to the specific room and receiver
      socket.to(room).emit("receive-message", messageData);
      socket.to(receiverId).emit("receive-message", messageData);

      addMessage({roomId, senderId, receiverId, content, type});
    });

    // Handle typing notifications
    socket.on("typing", ({ room }) => {
      socket.to(room).emit("user-typing", socket.User.userName);
    });

    // Handle file uploads
    socket.on("file-upload", (formData) => {
      const { room, sender } = formData;
      // Process the file (saving, etc.)
      console.log("File uploaded by:", sender);

      // Notify the room of the file
      io.to(room).emit("receive-message", {
        content: "File uploaded",
        senderId: socket.User.userId,
        senderName: socket.User.userName,
        room,
        timestamp: new Date(),
        type: "file",
        fileUrl: "url-to-file", // Replace with actual file URL after processing
      });
    });

    // Handle pagination for loading older messages
    socket.on("load-older-messages", async ({ room, page }) => {
      const messages = await getOlderMessages(room, page);
      socket.emit("older-messages", messages);
    });

    // Handle disconnects
    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.User.userName);
      onlineUsers.delete(socket.User.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });
};


