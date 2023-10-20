import React, { useState, useContext, useEffect, useRef } from "react";
import { WebsocketContext } from "../context/websocket.context";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './ChatInterface.css'
import { Context } from "react-responsive";
import { Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";

interface Message {
id: number;
text: string;
sender: string;
sender_Name: string;
date: string;
}

export interface sentMessages {
	id: number;
	user_id: number;
	user_name: string;
	chat_id: number;
	text: string;
	date: string;
}

interface Props {
	messagesData: sentMessages[];
	currentRoomProps: string;
	chatSocket: Socket;
}

const ChatInterface: React.FC<Props> = ({messagesData, currentRoomProps, chatSocket}: Props) => {
const [value, setValue] = useState('');
const [currentRoom, setCurrentRoom] = useState<string>(currentRoomProps);
const [isLoading, setIsLoading] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [newMessage, setNewMessage] = useState<Message>({ id: 0, text: '', sender: '', sender_Name: '', date: '' ,});
const socket = chatSocket;
const token: string | undefined = Cookies.get("token");
const [content, setContent] = useState<{username: string, user: number, avatar: string}>();
const [roomName, setRoomName] = useState<string>('');
const socketRef = useRef(null);

// useEffect(() => {
// 	socket.connect();
// 	}, []);

	useEffect(() => {
		console.log("messagesData: ", messagesData);
		setMessages(messagesData.map((message) => (
		{
			id: message.id,
			text: message.text,
			sender: message.user_id.toString(),
			sender_Name: message.user_name,
			date: message.date
		}
		)));
		setCurrentRoom(currentRoomProps);
	},[messagesData, currentRoomProps]);

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

	// socket.on('connect', () => {
	// socket.emit('join-room', {roomName:'default', client: socket});
	// });

	socket.on('srv-message', (data) => {
	console.log(`srv-message ${data}`);
	const latest: Message = { id: messages.length + 3, text: data.text, sender: data.sender, sender_Name: data.sender_Name, date: data.date };
	if (data.room == currentRoom)
	{
		setMessages([...messages, latest]);
	}
	else 
	{
		// alert(`You have a new message in another room: ${data.text}`);
		toast.info(latest.text + ' in ' + data.room, { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-info' })
	}
	});

	return () => {
	console.log('Unregistering events...');
	socket.off('connect');
	socket.off('srv-message');
	};
}, [token, socket, messages, currentRoom]);

function handleSendMessage(sender: string = content?.username || 'user') {
	if (!newMessage.text.trim() || !socket.connected) {
	return;
	}
	socket.emit('create-something', {
	text: newMessage.text,
	sender: socket.id,
	sender_Name: sender,
	user_id: content?.user,
	date: new Date().toLocaleTimeString(),
	room: currentRoom,
	});
	console.log('Message sent:', newMessage.text);
	setNewMessage({ id: 0, text: '', sender: '', sender_Name: '', date: '' });
}

return (
	<div>
	<div className="message-display">
		<div className="message-box">
		{messages.map((message) => (
			<div key={message.id} className={`message-bubble ${message.sender_Name === content?.username ? 'user-message' : 'other-message'}`}>
			<span className="message-sender">{message.sender_Name}</span> <br/>
			<span className="message-text">{message.text}</span> <br/>
			<span className="message-date">{message.date}</span>
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
			setNewMessage({ id: messages.length + 1, text: e.target.value, sender: '', sender_Name: username, date: Date.now().toString() })}
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
