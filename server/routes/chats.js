import express from "express"
import { addRoom, getAllChats, getOlderMessages } from "../controllers/chatController.js"
import userAuth from "../middleware/auth.js"

const router = express.Router()

router.get("/get",userAuth, getAllChats)
router.get("/messages/:roomId/",userAuth,getOlderMessages)
router.post("/add",userAuth, addRoom)


export default router