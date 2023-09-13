import React, { useState, useEffect } from 'react';
import '../pages/Chat.css';
import io from 'socket.io-client';

interface Message {
  id: number;
  text: string;
  sender: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<Message>({ id: 0, text: '', sender: ''}); // Updated to a string
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8080');

    newSocket.on('connect', () => {
      console.log('Connected to server!');
    });

    newSocket.on('messages', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, { id: prevMessages.length + 1, text: message, sender: 'other' }]);
    });

    setSocket(newSocket);

    // Clean up the connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('message', newMessage);
      console.log('Message sent:', newMessage);

    }
    setMessages([...messages, newMessage]);
    setNewMessage({ id: 0, text: '', sender: ''}); // Clear the input field
  };

  return (
    <div className="chat-interface">
      <div className="message-display">
        <div className="character-picture">N</div>
        {messages.map((message) => (
          <div
            key={message.id} // Use message.id as the key
            className={`message-bubble ${
              message.sender === 'user' ? 'user' : 'other'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          className="messages"
          type="text"
          placeholder="Type your message..."
          value={newMessage.text}
          onChange={(e) => setNewMessage({id: 0, text: e.target.value, sender: 'user'})}
        />
        <button className="sendButton" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;






/*


import React from 'react';
import MessageInput from './handleMessages';
import { useState, useEffect } from 'react';
import '../pages/Chat.css'
import ChatSocket from './socketchat';
import io from 'socket.io-client'

interface Message {
  id: number;
  text: string;
  sender: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<Message>({ id: 0, text: 'hello', sender: 'user' });
  const [socket, setSocket] = useState<any>([]);
  // const handleSendMessage = () => {
    useEffect(() => {
    const newSocket = io('http://localhost:3000');

    newSocket.on('connect', () => {
		  console.log('Connected to server!')    });
    newSocket.on('messages', (messages: string) => {
		  setMessages((prevMessages) => [...prevMessages, messages]);
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
		  console.log('are we here?')    };
    }
    setNewMessage({ id: 0, text: 'default', sender: 'user'});
    console.log('or here?')


  //   if (newMessage.trim() === '') return; // Don't send empty messages

    const newMessages: Message = {
      id: messages.length + 1,
      text: newMessage.text,
      sender: 'other', // Replace with actual user information
    };

	// setMessages([...messages, newMessage]);
	// setNewMessage('');
  // };

  return (
    <div className="chat-interface">
      <div className="message-display">
		  <div className="character-picture"> N </div>
        {messages.map((message) => (
			<div
            key={message}
            className={`message-bubble ${
				newMessage.sender === 'User' ? 'user' : 'other'
            }`}
			>
            {newMessage.text}
          </div>
		  ))}
      </div>
	  <div className="message-input">
        {<input className='messages'
          type="text"
          placeholder="Type your message..."
          value={newMessage.text}
          onChange={(e) => setNewMessage({id: 0, text: e.target.value, sender: 'user'})}
        />}
        <button className='sendButton' onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
*/
