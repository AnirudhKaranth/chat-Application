import jwt from "jsonwebtoken"

export const initialize = async(io)=>{
    io.use((socket, next) => {
        
      // console.log(socket.handshake.auth.token)
      if(!socket?.handshake?.auth?.token){
        return next(new Error("Authentication Error"));
      }
     
          const token = socket.handshake.auth.token;
          // if (!token) return next(new Error("Authentication Error"));
      console.log(token)
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          socket.User={
             userId: decoded.userId, userName: decoded.userName
          }
          next();
        });
    //   });

    io.on("connection",(socket)=>{
        console.log("user connected")
        console.log(socket.User)
        socket.on("message", ({ recieverId, room, message, type }) => {
            console.log({recieverId, room, message });
            socket.to(recieverId).emit("receive-message", message);
          });
        
          socket.on("join-room", (room) => {
            socket.join(room);
            console.log(`User joined room ${room}`);
          });
        
          socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
          });

    })
}