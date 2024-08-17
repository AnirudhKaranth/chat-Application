import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const Home = () => {
  const token = localStorage.getItem("token") 
  const user = localStorage.getItem("user")
  if(!token || !user){
    return <div>Not Authorized</div>
  }
  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        auth: {
          token: token
        }
      }),
    []
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("")
  const [contacts, setContacts] = useState([])


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(socket)
    socket.emit("message", { message, room });
    setMessage("");
  };

  const getAllchats = async()=>{
        
  }

 
  useEffect(() => {
    getAllchats()
  
  }, [contacts])

  useEffect(() => {
    socket.on("connect", () => {
        setSocketId(socket.id);
        console.log("connected", socket.id);
        
      });
      
      socket.emit("join-room", user.id)
  
      socket.on("receive-message", (data) => {
        console.log(data);
      });
  
      socket.on("welcome", (s) => {
        console.log(s);
      });
  
      return () => {
        socket.disconnect();
      };
  }, []);

  return (
    <div className="flex flex-row"> 
        <div>
            contacts
        </div>





        <div>
            <div>
                chat
            </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>


        </div>
    </div>
  );
};

export default Home;
