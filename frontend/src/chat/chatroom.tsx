import React from 'react';
import MessageInput from './handleMessages';
import { useState } from 'react';
import '../pages/Chat.css'

interface Message {
  id: number;
  text: string;
  sender: string;
}

const ChatInterface: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');

  const handleSendMessage = () => {
    if (messageText.trim() === '') return; // Don't send empty messages

    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'other', // Replace with actual user information
    };

	setMessages([...messages, newMessage]);
	setMessageText('');
  };

  return (
    <div className="chat-interface">
      <div className="message-display">
		  <div className="character-picture"> hello </div>
        {messages.map((message) => (
			<div
            key={message.id}
            className={`message-bubble ${
				message.sender === 'User' ? 'user' : 'other'
            }`}
			>
            {message.text}
          </div>
		  ))}
      </div>
	  <div className="message-input">
        <input className='messages'
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button className='sendButton' onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;

