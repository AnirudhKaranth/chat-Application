import React, { useEffect, useState } from "react";

const ContactItem = ({
  socket,
  id,
  noOfMessages,
  contactName,
  contactId,
  lastMessage,
  time,
  showChat,
}) => {
  const [lastMsg, setlastMsg] = useState(lastMessage);
  const [noOfMsg, setNoOfMsg] = useState(noOfMessages);

  useEffect(() => {
    socket.on("lastMessage", ({ roomId, msg }) => {
      if (roomId === id) {
        setlastMsg(msg);
      }
    });

    socket.on("receive-message", (message) => {
      console.log(noOfMessages);
      if (message.roomId === id) {
        setNoOfMsg(noOfMsg + 1);
      }
    });

    socket.on("saw", ({ roomId }) => {
      if (roomId === id) {
        setNoOfMsg(0);
      }
    });
  }, [socket]);

  const FirstLetterOfUser = contactName?.split("")[0];
  console.log(noOfMessages);
  return (
    <div
      id={id}
      tabIndex={0}
      className="flex w-full m-1 justify-between items-center p-4 hover:bg-gray-800 cursor-pointer focus:bg-gray-800"
      onClick={() => showChat({ roomId: id, contactId, contactName })}
    >
      <div className="flex items-center space-x-4">
        <div
          className=" w-8 h-8 rounded-full flex justify-center text-black items-center hover:bg-gray-300"
          style={{ fontSize: "20px", backgroundColor: "#efefef" }}
        >
          {FirstLetterOfUser}
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold">{contactName}</h2>
          <p className="text-gray-400 text-sm">{lastMsg}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">{time}</p>
        {noOfMessages > 0 && (
          <div
            className={`${
              noOfMsg > 0 ? "bg-blue-500" : "bg-custom-dark"
            } text-white text-xs font-bold px-2 py-1 rounded-full text-center mt-1`}
          >
            {noOfMsg > 0 ? noOfMsg : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactItem;
