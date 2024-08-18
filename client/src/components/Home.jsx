import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import Contacts from "./Contacts";
import Chat from "./Chat";

const Home = () => {
  
  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")
  // const [token , setToken] = useState("")
  const [selectedRoom, setSelectedRoom] = useState(null);
  // const socket = useRef(null);
  // if(!token || !user){
  //   return <div>Not Authorized</div>
  // }
  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        auth: {
          token: token
        }
      }),
    []
  );
  // const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState([]);
  // const [room, setRoom] = useState("")
  // const [contacts, setContacts] = useState([])


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(socket)
  //   // socket.emit("message", { message, room });
  //   setMessage("");
  // };


  const showChat = ({roomId, contactId, contactName}) => {
    setSelectedRoom({roomId, contactId, contactName}); // Set the selected chat room when a contact is clicked
  };
  console.log(socket)
 

  useEffect(() => {
  

    socket.emit("join-room", user.id);


    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    
  }, [selectedRoom]);
  
  return (
    <div className="flex flex-row h-screen w-full"> 
        <div className="w-1/3 h-full">
          <Contacts socket={socket} showchat={showChat} token={token} />
        </div> 

        <div className="w-4/6 border-2 border-gray-500">
        {selectedRoom ? (
          <Chat socket={socket} room={selectedRoom} user={user} /> // Pass selectedRoom and user to Chat component
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
