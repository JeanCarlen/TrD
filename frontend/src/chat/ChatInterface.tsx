import React, { useState, useContext, useEffect, useRef } from "react";
import { WebsocketContext } from "../context/websocket.context";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './ChatInterface.css'
import { Context } from "react-responsive";
import { Socket } from "socket.io-client";

interface Message {
id: number;
text: string;
sender: string;
sender_Name: string;
date: string;
}

const ChatInterface: React.FC = () => {
const [value, setValue] = useState('');
const [currentRoom, setCurrentRoom] = useState<string>('default');
const [isLoading, setIsLoading] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [newMessage, setNewMessage] = useState<Message>({ id: 0, text: '', sender: '', sender_Name: '', date: '' });
const [rooms, setRooms] = useState<string[]>([]); // State variable for rooms
const socket = useContext(WebsocketContext);
const token: string | undefined = Cookies.get("token");
const [content, setContent] = useState<{username: string, user: number, avatar: string}>();
const [roomName, setRoomName] = useState<string>('');
const socketRef = useRef(null);

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
	setMessages([...messages, latest]);
	});

	return () => {
	console.log('Unregistering events...');
	socket.off('connect');
	socket.off('srv-message');
	};
}, [token, socket, messages, currentRoom]);


const handleRoomChange = (room: string) => {
	console.log("trying room: ", room);
	socket.emit('join-room', { roomName: room, socketID: socket.id });
	setCurrentRoom(room);
	console.log("Joined room: ", room);
	setMessages([]);
};

const handleJoinRoom = () => {
    if (roomName.trim() !== '') 
	{
	  setRoomName(roomName);
	  console.log("Joining room: ", roomName);
      handleRoomChange(roomName);
      setRoomName('');
    }
  };

const handleCreateRoom = () => {
	const roomName = prompt("Enter a name for the new room:");
	if (roomName) {
	socket.emit('create-room', {
		roomName: roomName,
		client: content?.user
	});
	//handleRoomChange(roomName);
	}
};

function handleSendMessage(sender: string = content?.username || 'user') {
	if (!newMessage.text.trim() || !socket.connected) {
	return;
	}
	socket.emit('create-something', {
	text: newMessage.text,
	sender: socket.id,
	sender_Name: sender,
	date: new Date().toLocaleTimeString(),
	room: currentRoom, // Include the current room in the message data
	});

	console.log('Message sent:', newMessage.text);

	const updatedMessage: Message = {
	id: messages.length + 3,
	text: newMessage.text,
	sender: '',
	sender_Name: 'user',
	date: new Date().toLocaleTimeString(),
	};

	setNewMessage({ id: 0, text: '', sender: '', sender_Name: '', date: '' });
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

	{/* Display the list of rooms */}
	<p>Available Rooms:</p>
        <button onClick={handleCreateRoom}>Create New Room</button>
        <ul>
          {rooms.map((room) => (
            <li key={room}>
              <button onClick={() => handleRoomChange(room)}>{room}</button>
            </li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
	<div className="message-display">
		<div className="message-box">
		{messages.map((message) => (
			<div key={message.id} className={`message-bubble ${message.sender === content?.username ? 'user-message' : 'other-message'}`}>
			<span className="message-sender">{message.sender}</span> <br/>
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
