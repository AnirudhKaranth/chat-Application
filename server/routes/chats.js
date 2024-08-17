import express from "express"
import { getAllChats } from "../controllers/chatController.js"
import userAuth from "../middleware/auth.js"

const router = express.Router()

router.get("/get",userAuth, getAllChats)




export default router