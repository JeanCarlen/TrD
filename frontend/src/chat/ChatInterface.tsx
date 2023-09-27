import React, { useState, useContext, useEffect } from "react";
import { WebsocketContext } from "../context/websocket.context";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './Chat.css'

interface Message {
  id: number;
  text: string;
  sender: number;
  sender_Name: string;
  date: string;
}

const ChatInterface: React.FC = () => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<Message>({ id: 0, text: '', sender: 0, sender_Name: '', date: '' });
  const socket = useContext(WebsocketContext);
  const token: string | undefined = Cookies.get("token");
  const [content, setContent] = useState<{username: string, user: number, avatar: string}>();

  useEffect(() => {
    if (token === undefined) {
      return;
    }

    setContent(decodeToken(token));

    socket.on('connect', () => {
      console.log(socket.id);
      setIsLoading(false);
      console.log('Connected');
    });

    socket.on('srv-message', (data) => {
      console.log(`srv-message ${data}`);
      const latest: Message = { id: messages.length + 3, text: data.text, sender: data.sender, sender_Name: data.sender_Name, date: data.date };
      setMessages([...messages, latest]);
    });

    socket.on('broadcast', (data) => {
      console.log('mange tes morts');
    });

    return () => {
      console.log('Unregistering events...');
      socket.off('connect');
      socket.off('srv-message');
    };

  }, [token, socket, messages]);

  function handleSendMessage(sender: string = content?.username || 'user') {
    if (!newMessage.text.trim() || !socket.connected) {
      return;
    }
    socket.emit('create-something', {
      text: newMessage.text,
      sender: sender,
      date: new Date().toLocaleTimeString(), // Add date to the message data
    });

    console.log('Message sent:', newMessage.text);

    // Remove the line that overwrites the date property
    const updatedMessage: Message = {
      id: messages.length + 3,
      text: newMessage.text,
      sender: 0,
      sender_Name: 'user',
      date: new Date().toLocaleTimeString(),
    };

    setNewMessage({ id: 0, text: '', sender: 0, sender_Name: '', date: '' });
  }

  function connect(e: React.FormEvent) {
    e.preventDefault();
    if (!socket.connected) {
      setIsLoading(true);
      socket.connect();
    }
  }

  return (
    <div>
      {isLoading && <p>Loading...</p>}

      <button onClick={connect} disabled={isLoading || socket.connected}>
        {socket.connected ? "Connected" : "Connect"}
      </button>
      <div className="chat-interface">
        <div className="message-display">
          <div className="character-picture">bob</div>
          {messages.map((message) => (
            <div key={message.id} className={`message-bubble ${message.sender_Name === message.sender_Name ? message.sender_Name : 'other'}`}>
              <div className="message-header">
                <span className="message-sender">{message.sender_Name}</span>
                <span className="message-date">{message.date}</span>
              </div>
              <span className="message-text">{message.text}</span>
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            className="messages"
            type="text"
            placeholder="Type your message..."
            value={newMessage.text}
            onChange={(e) => {
              let username = content?.username;
              if (username === undefined)
                username = 'user';
              setNewMessage({ id: messages.length + 1, text: e.target.value, sender: 0, sender_Name: username, date: Date.now().toString() })}
          }
          />
          <button className="sendButton" onClick={() => handleSendMessage()}>
            user
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
