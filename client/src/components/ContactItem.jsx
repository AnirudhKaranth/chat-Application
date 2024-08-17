import React from 'react';

const ContactItem = ({ noOfMessages, contactName, lastMessage, time , showChat}) => {
  return (
    <div className="flex justify-between items-center p-4 hover:bg-gray-800 cursor-pointer" onClick={showChat}>
      <div className="flex items-center space-x-4">
        <img
          src="/path/to/profile-picture.jpg"
          alt={`${contactName}'s profile`}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-white text-lg font-semibold">{contactName}</h2>
          <p className="text-gray-400 text-sm">{lastMessage}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">{time}</p>
        {noOfMessages > 0 && (
          <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full text-center mt-1">
            {noOfMessages}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactItem;
