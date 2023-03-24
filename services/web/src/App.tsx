import React from "react";
import { io, Socket } from "socket.io-client";

import styles from "./App.module.css";

type ServerToClientEvents = {
  connect: () => void;
  receive: (message: string) => void;
};

type ClientToServerEvents = {
  message: (message: string) => void;
};

type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type Message = {
  id: string;
  body: string;
  createdAt: Date;
};
type State = {
  id?: string;
  messages: Message[];
};

const initialState: State = {
  id: undefined,
  messages: [],
};

const socket: MySocket = io("http://localhost", {
  autoConnect: false,
});
function App() {
  const [id, setId] = React.useState(initialState.id);
  const [messages, setMessages] = React.useState(initialState.messages);

  React.useEffect(() => {
    socket.connect();

    if (!socket.hasListeners("connect")) {
      socket.on("connect", () => {
        console.log("Connected to server: ", socket.id);
        setId(socket.id);
      });
    }

    if (!socket.hasListeners("receive")) {
      socket.on("receive", (message) => {
        const data = JSON.parse(message);
        console.log("Message from server: ", data);

        setMessages((messages) => [
          ...messages,
          { id: data.id, body: data.message, createdAt: data.createdAt },
        ]);
      });
    }

    return () => {
      socket.off("connect");
      socket.off("receive");

      socket.disconnect();
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
    <div className={styles.container}>
      <div>
        <h1>WebSocket + RabbitMQ</h1>
      </div>
      <div className={styles.messages}>
        {messages.map((message, index) => {
          const isSelf = id === message.id;
          return (
            <div className={styles.message} key={index}>
              <div
                className={
                  styles["message-meta"] +
                  (isSelf ? ` ${styles["message-meta--self"]}` : "")
                }
              >
                <span
                  className={
                    styles["message-body"] +
                    (isSelf ? ` ${styles["message-body--self"]}` : "")
                  }
                >
                  {message.body}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles["form-container"]}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="message"
            placeholder="メッセージを入力してください"
            className={styles.input}
          />
          <div>
            <button type="submit" className={styles.button}>
              送信する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
