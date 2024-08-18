import React, {socket, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Chat = ({socket, room, user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  const [isOnline, setIsOnline] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(1);

 
  const chatEndRef = useRef(null);



  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { roomId: room.roomId, contactId: room.contactId });
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        setIsTyping(false);
        socket.emit("stop-typing", { roomId: room.roomId, contactId: room.contactId  });
      }, 2000)
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(now.getDate()).padStart(2, '0');
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let newMessage = {
      content: message,
      receiverId:room.contactId,
      roomId:room.id,
      type:"text",
       day: `${day}-${month}-${year}`,
        hrs: `${hours}:${minutes}`
    };

    socket.emit("message", newMessage);
    
    
    setMessages((prevMessages) => [...prevMessages, {content: message,
      senderId: user.id,
      senderName: user.name,
      roomId:room.id,
      type: type || "text", // Default to "text" if no type is provided
      day: `${day}-${month}-${year}`,
      hrs: `${hours}:${minutes}`,
      seen:false
    }]);
    setMessage("");
  };
 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("room", room);
      formData.append("sender", user);

      // Handle file upload here (e.g., send via Socket.IO or API)
      socket.emit("file-upload", formData);

      setFile(null);
    }
  };


  const loadOlderMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/chat//messages/${room?.id}/${page}`, {
        headers: {
          "method":"GET",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const {allMessages} = await response.json();
      setMessages((prevMessages) => [...allMessages, ...prevMessages]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading older messages:", error);
    }
  };
console.log(room)
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    
    if (socket && room.contactId) {
      console.log("first")
      socket.emit("check", { userId: room.contactId });
    }

    socket.on("status",(status)=>{
      console.log("first")
      setIsOnline(status)
    })
    socket.on("myStatus",(data)=>{

      console.log(data)
    })
    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("user-typing",(data)=>{
      if(data.roomId === room.id){
        setTyping(true)
      }
    })

    socket.on("user-stoped", (data) => {
      if (data.roomId === room.roomId ) {
        setTyping(false);
      }
    })

    return () => {
      socket.off("receive-message")
      socket.off("typing");
      socket.off("stop-typing");
    }
    
  }, [socket, room.id, room.contactId ]);


  
  return (
    
    <div className="w-full h-full flex flex-col justify-between border-2 border-gray-500">
      <div className="h-24 flex items-center justify-start border-2 border-red-200 w-full">
      <div className=' w-10 h-10 rounded-full flex justify-center text-black items-center hover:bg-gray-300 m-2' style={{ "fontSize": "30px", "backgroundColor": "#efefef" }}>{room?.contactName?.split("")[0]}</div>
      <div className=" flex flex-col mx-2">
      <div className="text-white m-2 text-2xl font-semibold">{room?.contactName} </div>
      <span className="text-white m-2">{isOnline?"online":"offline"}</span>

      </div>
      </div>
      <div
        className="overflow-auto h-full"
        onScroll={(e) => {
          if (e.target.scrollTop === 0) {
            loadOlderMessages();
          }
        }}
        >
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 ${msg.senderId === user.id ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-md ${msg.senderId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.content}
            </div>
            <div className="text-xs text-gray-500">
              {msg.hrs}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {typing && <div className="p-2 text-gray-500">Typing...</div>}

      <form onSubmit={handleSendMessage} className="flex items-center p-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleTyping}
          className="flex-1 border p-2 rounded-md"
          
        />
        <input type="file" onChange={handleFileChange} className="ml-2" />
        <button
          type="button"
          onClick={handleFileUpload}
          className="ml-2 p-2 bg-gray-500 text-white rounded-md"
        >
          Upload
        </button>
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-md">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
