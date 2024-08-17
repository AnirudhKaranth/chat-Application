import express from "express"
import cors from "cors"
import "dotenv/config"
import { createServer } from "http";
import { Server } from "socket.io";
import userRouter from "./routes/user.js"
import chatRouter from "./routes/chats.js"

import { initialize } from "./socket/index.js";
const port = 8000
const app = express()
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
      credentials: true
      
    },
  });
app.set("io", io);
initialize(io)

app.use("/api/v1/user",userRouter)
app.use("/api/v1/chat",chatRouter)



httpServer.listen(port,()=>{
    console.log(`server listening on port ${port}`)
})