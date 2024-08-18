import React, { useState, useEffect, useRef } from "react";
import FileBase64 from "react-file-base64";

const Chat = ({ socket, room, user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const chatContainerRef = useRef(null);
  const [readMessages, setReadMessages] = useState(false);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");

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
        socket.emit("stop-typing", {
          roomId: room.roomId,
          contactId: room.contactId,
        });
      }, 2000)
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); 
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    let newMessage = {
      content: message,
      receiverId: room.contactId,
      roomId: room.roomId,
      type: "text",
      fileName: null,
      day: `${day}-${month}-${year}`,
      hrs: `${hours}:${minutes}`,
    };

    socket.emit("message", newMessage);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: message,
        senderId: user.id,
        senderName: user.name,
        roomId: room.roomId,
        type: "text",
        fileName: null,
        day: `${day}-${month}-${year}`,
        hrs: `${hours}:${minutes}`,
        seen: false,
      },
    ]);
    setMessage("");
  };

  const handleFileUpload = () => {
    console.log(file);
    if (file) {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      let newMessage = {
        content: file,
        receiverId: room.contactId,
        roomId: room.roomId,
        type: fileType,
        fileName: fileName,
        day: `${day}-${month}-${year}`,
        hrs: `${hours}:${minutes}`,
      };

      socket.emit("message", newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: file,
          senderId: user.id,
          senderName: user.name,
          roomId: room.roomId,
          type: fileType,
          fileName: fileName,
          day: `${day}-${month}-${year}`,
          hrs: `${hours}:${minutes}`,
          seen: false,
        },
      ]);
      setFile(null);
    }
  };

  const loadOlderMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/chat/messages/${room.roomId}`,
        {
          headers: {
            method: "GET",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const allMessages = await response.json();
      allMessages.sort((a, b) => a.id - b.id);
      setMessages(allMessages);
    } catch (error) {
      console.error("Error loading older messages:", error);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    loadOlderMessages();
  }, [room.roomId]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (socket && room.contactId && room.roomId) {
      socket.emit("check", { userId: room.contactId });
      socket.emit("message-seen", {
        roomId: room.roomId,
        contactId: room.contactId,
      });
    }
    socket.on("seen", (data) => {
      if (data.roomId === room.roomId) {
        setReadMessages(true);
      }
    });
    socket.on("status", (status) => {
      setIsOnline(status);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
      scrollToBottom();
    });

    socket.on("user-typing", (data) => {
      if (data.roomId === room.roomId) {
        setTyping(true);
      }
    });

    socket.on("user-stoped", (data) => {
      if (data.roomId === room.roomId) {
        setTyping(false);
      }
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [socket, room.roomId, room.contactId]);

  return (
    <div className="w-full h-full flex flex-col justify-between border-2 border-gray-500">
      <div className="h-24 flex items-center justify-start border-2 border-gray-600 w-full">
        <div
          className=" w-10 h-10 rounded-full flex justify-center text-black items-center hover:bg-gray-300 m-2"
          style={{ fontSize: "30px", backgroundColor: "#efefef" }}
        >
          {room?.contactName?.split("")[0]}
        </div>
        <div className=" flex flex-col mx-2">
          <div className="text-white m-2 text-2xl font-semibold">
            {room?.contactName}{" "}
          </div>
          {typing ? (
            <span className="text-white m-2">typing...</span>
          ) : (
            <span className="text-white m-2">
              {isOnline ? "online" : "offline"}
            </span>
          )}
        </div>
      </div>
      <div ref={chatContainerRef} className="overflow-auto h-full">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`p-2 ${
              msg.senderId === user.id ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-1 rounded-md  ${
                msg.senderId === user.id
                  ? "bg-green-700 text-white"
                  : "bg-gray-800 text-white"
              }  `}
              style={{ maxWidth: "55%" }}
            >
              {msg.fileName ? (
                <>
                  <img
                    src={msg.content}
                    alt={msg.fileName}
                    style={{
                      minHeight: "25%",
                      minWidth: "100%",
                      maxWidth: "50%",
                      maxHeight: "100%",
                    }}
                  />
                  {msg.senderId === user.id && (
                    <span
                      className={` mx-2 ${
                        msg.seen || readMessages
                          ? "text-blue-500"
                          : "text-white"
                      }`}
                    >
                      {msg.seen || readMessages ? "✔✔" : "✔"}
                    </span>
                  )}
                </>
              ) : (
                <div>
                  {msg.content}{" "}
                  {msg.senderId === user.id && (
                    <span
                      className={` mx-2 ${
                        msg.seen || readMessages
                          ? "text-blue-500"
                          : "text-white"
                      }`}
                    >
                      {msg.seen || readMessages ? "✔✔" : "✔"}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">{msg.hrs}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center p-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleTyping}
          className="flex-1 border p-2 rounded-md"
        />
        <div className="">
          <FileBase64
            type="file"
            multiple={false}
            onDone={(data) => {
              setFile(data?.base64);
              setFileName(data?.file?.name);
              setFileType(data?.file?.type);
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleFileUpload}
          className="ml-2 p-2 bg-gray-500 text-white rounded-md"
        >
          Upload
        </button>
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
