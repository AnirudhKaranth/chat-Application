# Multi-User Messaging System

The **Multi-User Messaging System** is a real-time chat application designed for seamless communication between users. This project leverages modern web technologies to offer a robust and interactive messaging experience with features like real-time messaging, online status tracking, and more.

## Tech Stack

- **Frontend:**
  - **React (Vite):** A fast and optimized development setup using Vite, ensuring a smooth developer experience.
  - **Tailwind CSS:** A utility-first CSS framework for quickly styling the application.

- **Backend:**
  - **NodeJS with Express:** A lightweight, fast, and scalable backend using Express.js for building the API.
  - **Postgres with Drizzle ORM:** A powerful SQL database with Drizzle ORM for efficient and type-safe database queries.

- **Real-Time Communication:**
  - **Socket.IO:** Enables real-time, bidirectional communication between the client and server.

## Features

1. **Real-time Messaging:** Allows users to send and receive messages instantly across different chat rooms.
2. **Online/Offline Status:** Tracks and displays the online status of users in real-time.
3. **Typing Indicator:** Shows a “Typing…” indicator when a user is composing a message.
4. **Read Receipts:** Users can see when their messages have been read by others.
5. **Image Upload:** Supports image uploads in chats, enhancing the messaging experience.
6. **Infinite Scrolling:** Messages are loaded as you scroll to the top, providing a seamless chat history experience.

## Remaining Features

1. **Video Upload:** Plan to implement a video upload feature that allows users to share videos within chats, similar to the existing image upload feature.
2. **Read/Unread Message Sorting:** Implement a feature to sort messages based on their read/unread status, ensuring important unread messages are easily accessible to the user.


## Installation

### Prerequisites

- Node.js (v14.x or higher)
- PostgreSQL (v12.x or higher)
- Git

### Clone the Repository

```bash
git clone https://github.com/your-username/chat-Application.git
cd chat-Application
cd server
node index.js
cd ../client
npm i
npm run dev
```


