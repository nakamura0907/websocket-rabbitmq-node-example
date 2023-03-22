import React from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io("http://localhost");
function App() {

  React.useEffect(() => {
      socket.on('connect', () => {
        console.log('Connected to server: ' + socket.id);
      });
    
    socket.on('receive', (message: string) => {
      console.log('Message from server: ', message);
    });

    return () => {
      socket.off('connect');
      socket.off('receive');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = e.currentTarget.message.value;
    if (!message) return;

    socket.emit('message', message);
    e.currentTarget.message.value = '';
  }

  return (
    <div>
      <h1>
        WebSocket + RabbitMQ
      </h1>
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
