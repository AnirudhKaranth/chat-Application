import { eq, or } from "drizzle-orm"
import { db } from "../db/drizzle.config.js"
import { messages, rooms } from "../db/schema.js"

export const getAllChats = async(req, res)=>{
    try {
        const {userId} = req.User

        const chats = await db.select().from(rooms).where(or(eq(rooms.user1, userId), eq(rooms.user2, userId)))
        console.log(chats)
        res.status(200).json(chats)
        
    } catch (error) {
        res.status(500).json({
            msg:"something went wrong"
        })
    }
}

export const addMessage = async( roomId, senderId, receiverId, content, type )=>{
    try {
        
        await db.insert(messages).values({roomId, senderId, receiverId, content, type})
        return 0
        
    } catch (error) {
       return 1
    }
}


export const getAllMessages=async(req,res)=>{
    try {
        const {userId} = req.user
        const {roomId} = req.params
        const room = await db.select().from(rooms).where(eq(roomId,rooms.id))
        if(!room[0]){
            return res.status(500).json({
                msg:"something went wrong while fetching chat"
            })
        }

        if(!(room[0].user1 === userId || room[0].user2 === userId)){
            return res.status(500).json({
                msg:"Not Authorized"
            })
        }

        const messages = await db.select().from(messages).where(eq(roomId, messages.roomId))
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({
            msg:"something went wrong"
        })
    }
}