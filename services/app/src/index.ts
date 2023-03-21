import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

// Socket.ioの型
type ServerToClientEvents = {};
type ClientToServerEvents = {};
type InterServerEvents = {};
type SocketData = {};

// サーバー設定
const app = express();
const httpServer = createServer(app);
const io = new Server<
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData
>(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
});

// RabbitMQ設定

// WebSocketイベント
io.on("connection", (socket) => {
    console.log(socket.id);
})

// サーバーリッスン
const port = 3001;
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});