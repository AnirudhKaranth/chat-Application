import React, { useEffect, useState } from "react";
import ContactItem from "./ContactItem";

const Contacts = ({socket, showchat, token}) => {
  const [contacts, setContacts] = useState([]);
  
console.log(socket)

  const getAllchats = async () => {
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/chat/get",{
        method: "GET",
       headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
      },
      }); // Update the URL to your API endpoint
      const data = await response.json();
      console.log(data)
      setContacts(data?.chats);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    getAllchats();
  }, []);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setContacts((prevContacts) =>
        prevContacts.map((contact) => {
          if (contact.contactId === message.room) {
            return {
              ...contact,
              noOfMessages: (contact.noOfMessages || 0) + 1,
            };
          }
          return contact;
        })
      );
    });

   
    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  return (
    <div className="flex flex-col w-full">
      <div className="h-24 border-2 border-red-200 w-full">navbar</div>
      {contacts.length !== 0 ? (
        <div className="flex flex-col w-full">
          {contacts.map((item) => (
            <ContactItem
              key={item.chatId} // Replace `index` with a unique ID if available
              id={item.chatId} // Use `index` to create a unique ID for each item
              noOfMessages={item.noOfMessages}
              contactName={item.contactName}
              lastMessage={item.lastMessage}
              time={item.time}
              showChat={showchat}
              contactId={item.contactId}
            />
          ))}
        </div>
      ) : (
        <div>Add new contacts</div>
      )}
    </div>
  );
};

export default Contacts;
