import express from "express";
import amqp from "amqplib";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

// Socket.ioの型
type ServerToClientEvents = {
  receive: (message: string) => void;
};
type ClientToServerEvents = {
  message: (message: string) => void;
};
type InterServerEvents = {};
type SocketData = {};

type MySocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// サーバー設定
const app = express();
const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// RabbitMQ設定
const amqpUrl = "amqp://user:password@rabbitmq";
const amqpQueue = "chats";

// WebSocketイベント
const clients = new Set<MySocket>();
io.on("connection", (socket) => {
  clients.add(socket);

  (async () => {
    // RabbitMQ接続
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(amqpQueue);

    // メッセージ送信イベント
    socket.on("message", (message) => {
      console.log(`PUSH: ${socket.id} ${message}`);

      const now = new Date(
        new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
      );
      const content = JSON.stringify({
        id: socket.id,
        message,
        createdAt: now,
      });

      channel.sendToQueue(amqpQueue, Buffer.from(content));
    });

    // メッセージ受信イベント
    channel.consume(
      amqpQueue,
      (message) => {
        if (!message) return;

        const data = message.content.toString();
        for (const client of clients) {
          console.log(`PULL: ${client.id} ${data}`);
          client.emit("receive", data);
        }

        // 必要に応じて永続化する
        // exampleSaveUseCase.execute(data);
      },
      { noAck: true }
    );
  })();

  socket.on("disconnect", () => {
    clients.delete(socket);
  });
});

// サーバーリッスン
const port = 3001;
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
