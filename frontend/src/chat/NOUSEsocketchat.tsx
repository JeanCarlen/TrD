import React, { useEffect, useState } from 'react';
import {io} from 'socket.io-client';

const ChatSocket: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [socket, setSocket] = useState<any>([]);
  useEffect(() => {
    const newSocket = io('http://your-server-url');

    newSocket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Set the socket in state
    setSocket(newSocket);

    // Clean up the connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('message', newMessage);
	  
      setNewMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatSocket;
