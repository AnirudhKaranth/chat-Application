import React, { useEffect, useState } from "react";
import ContactItem from "./ContactItem";
import { IoMdAdd } from "react-icons/io";

const Contacts = ({ socket, showchat, token }) => {
  const [contacts, setContacts] = useState([]);
  const [userEmail, setuserEmail] = useState("");
  const [toggle, setToggle] = useState(false);

  const getAllchats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/chat/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setContacts(data?.chats);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };
  const toggleuserEmail = () => {
    setToggle(!toggle);
  };

  const handleuserEmail = async () => {
    try {
      if (userEmail.length === 0) {
        alert("Please Enter the email");
      } else {
        await fetch("http://localhost:8000/api/v1/chat/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userEmail: userEmail }),
        }).then((response) => {
          if (response.ok) {
            alert("chat created successfully");
            getAllchats();
          } else {
            alert("Invalid credentials");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllchats();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="h-24 border-2 border-gray-700 w-full flex justify-start gap-4 items-center relative">
        <button className="mx-5" onClick={toggleuserEmail}>
          <IoMdAdd fontSize={25} />
        </button>
        <div className="ml-10">Multi-User Chat Application</div>

        {toggle && (
          <div className="absolute top-2 left-4 bg-gray-700 w-52 flex flex-col items-center justify-center">
            <form
              onSubmit={handleuserEmail}
              className="bg-gray-700 w-52 flex flex-col items-center justify-center mt-2"
            >
              <input
                type="text"
                value={userEmail}
                onChange={(e) => setuserEmail(e.target.value)}
                placeholder="Enter the email"
                className="bg-gray-500 text-white w-48 rounded-lg p-2"
              />
              <button
                type="submit"
                className="w-1/2 bg-gray-400 rounded-lg my-2"
              >
                Add
              </button>
            </form>
          </div>
        )}
      </div>
      {contacts.length !== 0 ? (
        <div className="flex flex-col w-full">
          {contacts.map((item) => (
            <ContactItem
              socket={socket}
              key={item.chatId}
              id={item.chatId}
              noOfMessages={item.NoOfMessages}
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
