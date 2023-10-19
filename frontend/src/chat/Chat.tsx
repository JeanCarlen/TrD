import React, { useState, useContext, useEffect } from "react";
import { WebsocketContext } from "../context/websocket.context";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './ChatInterface.css'
import { list } from "@chakra-ui/react";
import { get } from "http";
import '../pages/Chat.css';
import IdChatUser from '../chat/idChatUser';
import ChatInterface from '../chat/ChatInterface';
import Sidebar from '../Components/Sidebar';
import { sentMessages } from './ChatInterface';
import { ToastContainer, toast } from 'react-toastify';

export type chatData = {
	id: number;
	chat_id : number;
	user_id: number;
	chat_name: string;
	password: string | null;
	protected: boolean;
}

const Chat: React.FC = () => {
	const socket = useContext(WebsocketContext);
	const token: string | undefined = Cookies.get("token");
	const [content, setContent] = useState<{username: string, user: number, avatar: string}>();
	const [data, setData] = useState<chatData[]>([]);
	const [fetched, setFetched] = useState<boolean>(false);
	const [currentRoom, setCurrentRoom] = useState<string>('default');
	const [roomName, setRoomName] = useState<string>('');
	const [messages, setMessages] = useState<sentMessages[]>([]);
	const [currentChat, setCurrentChat] = useState<chatData>();

	const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

	const getChats = async() => {
		setFetched(false);
		const token: string|undefined = Cookies.get("token");
		let content: {username: string, user: number, avatar: string};
		if (token != undefined)
		{
			content = decodeToken(token);
			setContent(content);
			console.log("content: ", content.user);
		}
		else
			content = { username: 'default', user: 0, avatar: 'default'};

		const response = await fetch(`http://localhost:8080/api/users/${content.user}/chats`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		})
		try {
			const data = await response.json();
			const print = JSON.stringify(data);
			console.log("data: ", print);
			if (response.ok)
			{
				console.log("data: ", data);
				setFetched(true);
				setData(data);
			}
			else
				console.log("error in the try");
		}
		catch (error) {
			console.log("error in the catch");
		}
	}

	const handleRoomChange = (room: string, password: string | null) => {
		console.log("next room: ", room);
		console.log("currentRoom is : ", currentRoom);
		// socket.emit('leave-room', { roomName: currentRoom, socketID: socket.id, client: content?.user }); -- removed to test
		socket.emit('join-room', { roomName: room, socketID: socket.id, client: content?.user, password: password });
		//check if the password was right -- otherwise set room to default
		setCurrentRoom(room);
		console.log("Joined room: ", room);
	};

	const handleJoinRoom = async (chat: chatData | undefined) => {
		if (chat === undefined)
		{
			toast.error('Error with chat', {
				position: toast.POSITION.BOTTOM_LEFT,
				className: 'toast-error'
			});
			return;
		}
		// await getChats();
		console.log("data in join: ", data);
		console.log("Joining room: ", chat.chat_name);
		//ask the password if there is one
		let passwordPrompt: string | null = null;
		if (chat.protected === true)
		{
			passwordPrompt = prompt("Enter the password for the room:");
			if (passwordPrompt != null)
			{
				if (passwordPrompt.trim() == '')
					passwordPrompt = null;
			}
			else
				return;
		}
		handleRoomChange(chat.chat_name, passwordPrompt);
		setRoomName(chat.chat_name);
		setCurrentChat(chat);
		getMessages(chat);
	};

	const getMessages = async(chat: any) => {
		const response = await fetch(`http://localhost:8080/api/chats/${chat.chat_id}/messages`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		})
		if (response.ok)
		{
			const messages: sentMessages[] = await response.json();
			setMessages(messages);
			// const printMessages = JSON.stringify(messages);
			console.log("messages: ", messages);
		}
		else
			console.log("error in the getMessages");
	}

	useEffect(() => {
		socket.connect();
		getChats();
	}, []);

	useEffect(() => {
		socket.on('error-join-room', (err) => {
			alert(err);
		});
	}, [socket]);


	const handleJoinRoomClick = async () => {
		const roomNamePrompt = prompt("Enter the name of the room you want to join:");
		
		if (roomNamePrompt)
		{
			console.log("roomNamePrompt: ", roomNamePrompt);
			if (roomNamePrompt.trim() !== '') 
			{
				// setRoomName(roomNamePrompt);
				// console.log("Joining room prompt: ", roomName);
				// handleRoomChange(roomNamePrompt);
				// getChats();
				let newRoom: chatData | undefined = data.find((chat: chatData) => chat.chat_name === roomNamePrompt);
				console.log("newRoom: ", newRoom);
				if (newRoom === undefined)
				{
					let emptyroom: chatData = {id: 0, chat_id: 0, user_id: 0, chat_name: roomNamePrompt, password: '_AskForThePassword_', protected: true};
					newRoom = emptyroom;
				}
				handleJoinRoom(newRoom);
				await delay(1000);
				await getChats();
			}
		}
		};

	const handleCreateRoom = async () => {
		const roomNamePrompt = prompt("Enter a name for the new room:");
		let passWordPrompt = prompt("Enter a password for the new room or left blank for no password:");

		if( passWordPrompt?.trim() === '')
			passWordPrompt = null;
		if (roomNamePrompt) {
		socket.emit('create-room', {
			roomName: roomNamePrompt,
			client: content?.user,
			Password: passWordPrompt,
		});
		}
		if (roomNamePrompt)
			setCurrentRoom(roomNamePrompt);
		await delay(1000);
		await getChats();
	};

	return (
		<div>
		<Sidebar/>
	<div className='HomeText'>
		Chat
	</div>
	<div className='grid'>
		<div className="leftColumn">
		<button onClick={handleCreateRoom}>Create New Room</button>
		<button onClick={handleJoinRoomClick}>Join Room</button>
		<div className="chatList">
		<p>currentRoom: {currentRoom}</p>
		{fetched ? <div className="history-1">
		{data.map((chat: chatData) => {
			return (
				<button onClick={() => handleJoinRoom(chat)} key={chat.id} className="game-stats" style={{flexDirection: "column"}}>
					<div className="box">{chat.chat_name}</div>
				</button>
			);
		})}
		</div> : <div className="history_1"> Loading...</div>}
	</div>
		</div>
		<div className="middleColumn">
			<ChatInterface messagesData={messages} currentRoomProps={currentRoom}/>
		</div>
		<div className="rightColumn">
			<IdChatUser chatData={currentChat} user_id={content?.user}/>
		</div>
	</div>
	</div>
	);
};

export default Chat;
