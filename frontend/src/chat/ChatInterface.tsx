import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './ChatInterface.css'
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

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
const [currentRoom, setCurrentRoom] = useState<string>(currentRoomProps);
const [messages, setMessages] = useState<Message[]>([]);
const [newMessage, setNewMessage] = useState<Message>({ id: 0, text: '', sender: '', sender_Name: '', date: '' ,});
const socket = chatSocket;
const token: string | undefined = Cookies.get("token");
const [content, setContent] = useState<{username: string, user: number, avatar: string}>();

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, []);

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
		scrollToBottom();
	},[messagesData, currentRoomProps]);

useEffect(() => {
	
	if (token === undefined) {
	return;
	}
	setContent(decodeToken(token));

	socket.on('srv-message', (data: {text: string, sender: string, sender_Name:string, date: string, room: string}) => {
	console.log(`srv-message ${data}`);
	const latest: Message = { id: messages.length + 3, text: data.text, sender: data.sender, sender_Name: data.sender_Name, date: data.date };
	if (data.room === currentRoom)
	{
		setAndScroll(latest)
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

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function setAndScroll(latest: Message){
	await setMessages([...messages, latest]);
	scrollToBottom();
}

const handleKeyPress = (e: React.KeyboardEvent) => {
	switch (e.key) {
		case 'Enter':
		if (document !== null && document.getElementById("myButton") !== null)
			document.getElementById("myButton")?.click()
		break;
		default:
		break;
	}
};

async function scrollToBottom() {
	await delay(75);
	let element = document.getElementById("display");
	if (element == null)
		return;
	element.scrollTop = element.scrollHeight
}

return (
	<div>
	<div className="message-display">
		<div id="display" className="message-box">
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
		<button id="myButton" className="sendButton" onClick={() => handleSendMessage()}>
			Send
		</button>
		</div>
	</div>
	</div>
);
};

export default ChatInterface;
