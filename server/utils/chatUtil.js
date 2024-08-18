export const getNoOfUnseenMesssagesByChatId =async(chatId, userId)=>{

    let NoOfMessagesRes = await db
            .select({
                 count: count() 
            })
            .from(messages)
            .where(
              and(and(

                  eq(messages.roomId, chatId),
                  eq(messages.receiverId, userId),
                ),
                eq(messages.seen, false)
              )
            ).groupBy(messages.roomId);
            let NoOfMessages = NoOfMessagesRes[0]?.count || 0;

    return NoOfMessages;
    
}

export const addMessage = async( {roomId, senderId, receiverId, content, type} )=>{
    try {
        
        await db.insert(messages).values({roomId, senderId, receiverId, content, type})
        return 0
        
    } catch (error) {
       return 1
    }
}