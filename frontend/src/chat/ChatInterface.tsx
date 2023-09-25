import React, { useState, useContext, useEffect } from "react";
import { WebsocketContext } from "../context/websocket.context";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';

interface Message {
id: number;
text: string;
sender: string;
}

const ChatInterface: React.FC = () => {
const [value, setValue] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [newMessage, setNewMessage] = useState<Message>({ id: 0, text: '', sender: '' });
const socket = useContext(WebsocketContext);
const token: string | undefined = Cookies.get("token");

useEffect(() => {
	if (token === undefined) {
	return;
	}

	const content = decodeToken(token);

	socket.on('connect', () => {
	setIsLoading(false);
	console.log('Connected');
	});

	socket.on('srv-message', (data) => {
	console.log(`srv-message ${data}`);
	// const latest: Message = { id: messages.length + 1, text: data, sender: 'other' };
	const latest: Message = { id: messages.length + 1, text: data.text, sender: 'other' };
	setMessages([...messages, latest]);
	});

	return () => {
	console.log('Unregistering events...');
	socket.off('connect');
	socket.off('srv-message');
	};

}, [token, socket, messages]);

function handleSendMessage(sender: string) {
	if (!newMessage.text.trim() || !socket.connected) {
	return;
	}

	socket.emit('create-something', {
	text: newMessage.text,
	sender: sender,
	});

	console.log('Message sent:', newMessage.text);

	const updatedMessage: Message = {
	id: messages.length + 1,
	text: newMessage.text,
	sender: sender,
	};

	setMessages([...messages, updatedMessage]);
	setNewMessage({ id: 0, text: '', sender: '' });
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
		<div
			key={message.id}
			className={`message-bubble ${message.sender === 'user' ? 'user' : 'other'}`}
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
			onChange={(e) => setNewMessage({ id: messages.length + 1, text: e.target.value, sender: 'user' })}
		/>
		<button className="sendButton" onClick={() => handleSendMessage('user')}>
			user
		</button>
		</div>
		<div className="message-input">
		<input
			className="messages"
			type="text"
			placeholder="Type your message..."
			value={newMessage.text}
			onChange={(e) => setNewMessage({ id: messages.length + 1, text: e.target.value, sender: 'other' })}
		/>
		<button className="sendButton" onClick={() => handleSendMessage('other')}>
			other
		</button>
		</div>
	</div>
	</div>
);
};

export default ChatInterface;
