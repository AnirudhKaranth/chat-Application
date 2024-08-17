import express from "express"
import { login, signUp, updateStatus } from "../controllers/userController.js"
import userAuth from "../middleware/auth.js"

const router = express.Router()

router.post("/signup", signUp)

router.post("/login", login)
router.get("/status/:status",userAuth, updateStatus)




export default router