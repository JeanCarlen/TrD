import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './ChatInterface.css'
import '../pages/Chat.css';
import IdChatUser from '../chat/idChatUser';
import ChatInterface from '../chat/ChatInterface';
import Sidebar from '../Components/Sidebar';
import { sentMessages } from './ChatInterface';
import { ToastContainer, toast } from 'react-toastify';
import { Socket } from "socket.io-client";
import * as FaIcons from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { gsocket } from "../context/websocket.context";
import { useNavigate } from 'react-router-dom';
import GameInvite from "../Game/Game-Invite";



export type chatData = {
	id: number;
	chat_id : number;
	user_id: number;
	chat: {
		name: string,
		owner: number,
		type: number,
		password?: string,
		protected: boolean,
	},
	user: {
		username: string,
		email: string,
		avatar: string
	}
}

const Chat: React.FC = () => {
	const token: string | undefined = Cookies.get("token");
	const [content, setContent] = useState<{username: string, user: number, avatar: string}>();
	const [data, setData] = useState<chatData[]>([]);
	const [fetched, setFetched] = useState<boolean>(false);
	const [currentRoom, setCurrentRoom] = useState<string>('default');
	// const [roomName, setRoomName] = useState<string>('');
	const [messages, setMessages] = useState<sentMessages[]>([]);
	const [currentChat, setCurrentChat] = useState<chatData>();
	// const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const userStatus = useSelector((state: any) => state.userStatus);

	const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

	const getChats = async() => {
		setFetched(false);
		const token: string|undefined = Cookies.get("token");
		let content: {username: string, user: number, avatar: string};
		if (token !== undefined)
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
			if (response.ok)
			{
				setFetched(true);
				setData(data);
				return data as chatData[];
			}
			else
				console.log("error in the try");
		}
		catch (error) {
			console.log("error in the catch");
		}
	}

	const handleRoomChange = (room: string, password: string | null) => {
		gsocket.emit('join-room', { roomName: room, socketID: gsocket.id, client: content?.user, password: password });
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
		//ask the password if there is one
		let passwordPrompt: string | null = null;
		if (chat.chat.protected === true)
		{
			passwordPrompt = prompt("Enter the password for the room:");
			if (passwordPrompt != null)
			{
				if (passwordPrompt.trim() === '')
					passwordPrompt = null;
			}
			else
				return;
		}
		handleRoomChange(chat.chat.name, passwordPrompt);
		setCurrentChat(chat);
		getMessages(chat);
	};

	const getMessages = async(chat: chatData | undefined) => {
		if(chat === undefined)
			return;
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
		}
		else
			console.log("error in the getMessages");
	}

	const joinChatRooms = async (client: Socket) => {
		let joinData = await getChats();
		const token: string|undefined = Cookies.get("token");
		if (token) {
			let contentJoin: { username: string, user: number, avatar: string } = await decodeToken(token);
			await joinData?.map((chat: chatData) => {
				gsocket.emit('quick-join-room', {
					roomName: chat.chat.name,
					socketID: client.id,
					client: contentJoin?.user,
				});
			});
		}
	};
	
	useEffect(() => {
		joinChatRooms(gsocket);
		console.log("status", userStatus)
	}, []);

	useEffect(() => {

		gsocket.on('room-join-error', (message:{error: string, reset: boolean}) => {
			console.log("error in joining room: ", message.error);
			toast.error(message.error, {
				position: toast.POSITION.BOTTOM_LEFT,
				className: 'toast-error'});
		if (message.reset === true)
		{
			setCurrentRoom('default');
			setCurrentChat(undefined);
			setMessages([]);
		}
		});

		gsocket.on("smb-movede", () => {
			console.log("refreshing chats");
			getChats();
			setCurrentRoom('default');
			setCurrentChat(undefined);
			setMessages([]);
			});

		gsocket.on('refresh-chat', () => {
			console.log("refreshing chats");
			getChats();
		})

		gsocket.on('kick', (dataBack:{roomToLeave:string, UserToKick: number}) => {
			console.log("kicked: ", dataBack.UserToKick, "content: ", content?.user);
			if (dataBack.UserToKick !== content?.user)
				return ;
			console.log("you have been kicked")
			toast.error("You have been kicked", {
				position: toast.POSITION.BOTTOM_LEFT,
				className: 'toast-error'
			});
			setCurrentRoom('default');
			setCurrentChat(undefined);
			setMessages([]);
			getChats();
		})

		return() => {
			gsocket.off('room-join-error');
			gsocket.off("smb-movede");
			gsocket.off('kick');
		}
	}, [content]);


	const handleJoinRoomClick = async (dataPass: chatData[]) => {
		const roomNamePrompt = prompt("Enter the name of the room you want to join:");
		if (roomNamePrompt)
		{
			if (roomNamePrompt.trim() !== '') 
			{
				if(!fetched)
				{
					console.log("not fetched");
					return;
				}
				let newRoom: chatData | undefined = dataPass.find((chat: chatData) => chat.chat.name === roomNamePrompt);
				if (newRoom === undefined)
				{
					let emptyroom: chatData = {
						id: 0,
						chat_id: 0,
						user_id: 0,
						chat: {
							name: roomNamePrompt,
							owner: 0,
							type: 1,
							password: '_AskForThePassword_',
							protected: true,
						},
						user: {
							username: 'default',
							email: 'default',
							avatar: 'default'
						}
					}
					newRoom = emptyroom;
				}
				await handleJoinRoom(newRoom);
				await delay(1000);
				let newFetch =  await getChats();
				if (newFetch !== undefined)
					newRoom = newFetch.find((chat: chatData) => chat.chat.name === roomNamePrompt);
				delay(1000);
				getMessages(newRoom);
				if (newRoom !== undefined)
					setCurrentChat(newRoom);
			}
		}
		};

	const handleCreateRoom = async () => {
		const roomNamePrompt = prompt("Enter a name for the new room:");
		let passWordPrompt = prompt("Enter a password for the new room or left blank for no password:");

		if( passWordPrompt?.trim() === '')
			passWordPrompt = null;
		if (roomNamePrompt) {
		gsocket.emit('create-room', {
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
	<div className='grid_chat'>
		<div className="leftColumn">
		<button className="sendButton" onClick={handleCreateRoom}>Create New Room</button>
		<button className="sendButton" onClick={() => handleJoinRoomClick(data)}>Join Room</button>
		<div className="chatList">
		<p>currentRoom: {currentRoom}</p>
		{fetched ? <div className="history-1" style={{display: "flex", flexDirection: "column", rowGap: "1vh"}}>
		{data.map((chat: chatData) => {
			return (
				<button onClick={() => handleJoinRoom(chat)} key={chat.id} className="game-stats" style={{flexDirection: "column"}}>
					<div className="box">{chat.chat.name}
					{chat.chat.protected ? <FaIcons.FaLock/> : <></>}
					</div>
				</button>
			);
		})}
		</div> : <div className="history_1"> Loading...</div>}
	</div>
		</div>
		<div className="middleColumn">
			<ChatInterface messagesData={messages} currentRoomProps={currentRoom} chatSocket={gsocket}/>
		</div>
		<div className="rightColumn">
			<IdChatUser chatData={currentChat} user_id={content?.user} socket={gsocket}/>
		</div>
	</div>
	<GameInvite/>
	<ToastContainer />
	</div>
	);
};

export default Chat;
