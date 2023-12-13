import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import decodeToken from '../helpers/helpers';
import './ChatInterface.css'
import '../pages/Chat.css';
import IdChatUser from '../chat/idChatUser';
import ChatInterface from '../chat/ChatInterface';
import Sidebar from '../Components/Sidebar';
import { sentMessages } from './ChatInterface';
import { toast } from 'react-toastify';
import { Socket } from "socket.io-client";
import * as FaIcons from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { gsocket } from "../context/websocket.context";
import GameInvite from "../Game/Game-Invite";
import { TranslateChat } from "./chatNameTranslate";
import MoveAction from "../moveAction";



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
	display_name: string;
}

const Chat: React.FC = () => {
	const token: string | undefined = Cookies.get("token");
	const [content, setContent] = useState<{username: string, user: number, avatar: string}>();
	const [data, setData] = useState<chatData[]>([]);
	const [fetched, setFetched] = useState<boolean>(false);
	const [currentRoom, setCurrentRoom] = useState<string>('default');
	const [messages, setMessages] = useState<sentMessages[]>([]);
	const [currentChat, setCurrentChat] = useState<chatData>();
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
				await data.forEach(async (chat: chatData)=>{
					chat.display_name = await TranslateChat(chat, content?.user, token);
				});
				await delay(200 * data.length);
				setData(data);
				setFetched(true);
				return data as chatData[];
			}
			else
				
		}
		catch (error) {
			
		}
	}

	const handleRoomChange = async (room: string, password: string | null) => {
		gsocket.emit('join-room', { roomName: room, socketID: gsocket.id, client: content?.user, password: password });
		//check if the password was right -- otherwise set room to default
		const roomFake: chatData = {
			id: 0,
			chat_id : 0,
			user_id: 0,
			chat: {
				name: room,
				owner: 0,
				type: 0,
				protected: false,
			},
			user: {
				username: '',
				email: '',
				avatar: ''
			},
			display_name: '',
		};
		setCurrentRoom(await TranslateChat(roomFake, content?.user, token));
		
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
		// setCurrentChat(chat);
		// getMessages(chat);
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
				return (chat.chat_id);
			});
		}
	};
	
	useEffect(() => {
		joinChatRooms(gsocket);
		
	}, []);

	useEffect(() => {

		gsocket.on('room-join-error', (message:{error: string, reset: boolean}) => {
			
			toast.error(message.error, {
				position: toast.POSITION.BOTTOM_LEFT,
				className: 'toast-error'});
		if (message.reset === true)
		{
			setCurrentRoom('');
			setCurrentChat(undefined);
			setMessages([]);
		}
		});

		gsocket.on('login-ok', (nor: string)=>{
			
			getAndSet(nor);
		})

		gsocket.on("smb-movede", () => {
			
			getChats();
			setCurrentRoom('');
			setCurrentChat(undefined);
			setMessages([]);
			});

		gsocket.on('refresh-chat', () => {
			
			getChats();
		})

		gsocket.on('kick', (dataBack:{roomToLeave:string, UserToKick: number}) => {
			
			if (dataBack.UserToKick !== content?.user)
				return ;
			
			toast.error("You have been kicked", {
				position: toast.POSITION.BOTTOM_LEFT,
				className: 'toast-error'
			});
			setCurrentRoom('');
			setCurrentChat(undefined);
			setMessages([]);
			getChats();
		})

		return() => {
			gsocket.off('room-join-error');
			gsocket.off("smb-movede");
			gsocket.off('kick');
			gsocket.off('login-ok');
		}
	}, [content]);


	const getAndSet = async (nor: string) =>
	{
		let roomList;
		const response = await fetch(`http://localhost:8080/api/users/${content.user}/chats`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		});
		if (response.ok)
		{
			roomList = await response.json();
		
			if (roomList === undefined)
				return;
			let newR = roomList.find((one: chatData)=>(one.chat.name === nor))
			if (newR === undefined)
				return;
			setCurrentChat(newR);
			getMessages(newR);
		}
		else
			
	}

	const handleJoinRoomClick = async (dataPass: chatData[]) => {
		const roomNamePrompt = prompt("Enter the name of the room you want to join:");
		if (roomNamePrompt)
		{
			if (roomNamePrompt.trim() !== '') 
			{
				if(!fetched)
				{
					
					return;
				}
				let newRoom: chatData | undefined = dataPass.find((chat: chatData) => chat.chat.name === roomNamePrompt);
				if (newRoom === undefined)
				{
					let emptyroom: chatData = {
						id: 0,
						chat_id: 0,
						user_id: 0,
						display_name: '',
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
					<div className="box">{chat.display_name}
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
	<MoveAction/>
	</div>
	);
};

export default Chat;
