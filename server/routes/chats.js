import express from "express"
import { addRoom, getAllChats } from "../controllers/chatController.js"
import userAuth from "../middleware/auth.js"

const router = express.Router()

router.get("/get",userAuth, getAllChats)
router.post("/add",userAuth, addRoom)




export default router