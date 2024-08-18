import { and, count, eq, or, sql } from "drizzle-orm"
import { db } from "../db/drizzle.config.js"
import { messages, rooms, users } from "../db/schema.js"

export const getAllChats = async(req, res)=>{
    try {
        const {userId} = req.User

        const chats = await db.select().from(rooms).where(or(eq(rooms.user1, userId), eq(rooms.user2, userId)))
        let allChats =await Promise.all( chats.map(async(item)=>{
            let contactId = item.user1 === userId ? item.user2 : item.user1
            let contact= await db.select({contactName:users.name}).from(users).where(eq(users.id, contactId))
            let contactName=contact[0].contactName
            let NoOfMessagesRes = await db
            .select({
                 count: count() 
            })
            .from(messages)
            .where(
              and(and(

                  eq(messages.roomId, item.id),
                  eq(messages.receiverId, userId),
                ),
                eq(messages.seen, false)
              )
            ).groupBy(messages.roomId);
            let NoOfMessages = NoOfMessagesRes[0]?.count || 0;

            let msgObj={
                lastMessage: item.lastMessage,
                contactId,
                contactName,
                chatId: item.id,
                NoOfMessages

            }

            return msgObj
        })
    )
        res.status(200).json({chats:allChats})
        
    } catch (error) {
        res.status(500).json({
            msg:"something went wrong"
        })
    }
}




// export const getAllMessages=async(req,res)=>{
//     try {
//         const {userId} = req.user
//         const {roomId} = req.params
//         const room = await db.select().from(rooms).where(eq(roomId,rooms.id))
//         if(!room[0]){
//             return res.status(500).json({
//                 msg:"something went wrong while fetching chat"
//             })
//         }

//         if(!(room[0].user1 === userId || room[0].user2 === userId)){
//             return res.status(500).json({
//                 msg:"Not Authorized"
//             })
//         }

//         const messages = await db.select().from(messages).where(eq(roomId, messages.roomId))
//         res.status(200).json(messages)
//     } catch (error) {
//         res.status(500).json({
//             msg:"something went wrong"
//         })
//     }
// }


export const getOlderMessages = async (req, res) => {
    try {
        const {userId} = req.User
        const {roomId, page}= req.params
        const room = await db.select().from(rooms).where(eq(rooms.id,roomId))
        if(!(room[0]?.user1 === userId || room[0]?.user2 === userId)){
            return res.status(500).json({
                msg:"Not Authorized"
            })
        }
        const allMessages = await db.select().from(messages).where(eq(roomId, messages.roomId)).orderBy(desc(messages.id)).limit(15).offset(15*(Number(page)-1))

        res.status(200).json(allMessages)

        
    } catch (error) {
        res.status(500).json({
            msg:"something went wrong"
        })
    }
  };

export const addRoom = async(req,res)=>{
   try {
     const {user1} = req.body
     const {userId: user2} = req.User
     const room = await db.select().from(rooms).where(or(and(eq(rooms.user1,Number(user1)),eq(rooms.user2,Number(user2)) ),and(eq(rooms.user2,Number(user1)),eq(rooms.user1,Number(user2))) ))
     if(room[0]){
         return res.status(400).json({
             msg:"Chat Already Exists"
         })
     }
     await db.insert(rooms).values({user1, user2, lastMessage:""})
     // const chats = 
     res.status(200).json({
         msg:"chat created"
     })
   } catch (error) {
       console.log(error)
    res.status(500).json({
        msg:"something went wrong"
    })
   }
}


