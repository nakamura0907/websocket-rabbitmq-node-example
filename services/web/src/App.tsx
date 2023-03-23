import React from "react";
import { io, Socket } from "socket.io-client";

import "./App.css";

type ServerToClientEvents = {
  connect: () => void;
  receive: (message: string) => void;
};

type ClientToServerEvents = {
  message: (message: string) => void;
};

type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const socket: MySocket = io("http://localhost");
function App() {
  React.useEffect(() => {
    if (!socket.hasListeners("connect")) {
      socket.on("connect", () => {
        console.log("Connected to server: ", socket.id);
      });
    }

    if (!socket.hasListeners("receive")) {
      socket.on("receive", (message) => {
        console.log("Message from server: ", message);
      });
    }

    return () => {
      socket.off("connect");
      socket.off("receive");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = e.currentTarget.message.value;
    if (!message) return;

    socket.emit("message", message);
    e.currentTarget.message.value = "";
  };

  return (
    <div>
      <h1>WebSocket + RabbitMQ</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
