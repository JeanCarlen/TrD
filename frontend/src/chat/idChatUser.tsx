import React, { useContext, useEffect, useState } from 'react';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
	Button,
  } from '@chakra-ui/react'
  import { ChevronDownIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import '../pages/LetsPlay'
import Cookies from 'js-cookie';
import { chatData } from './Chat';
import { ChatForm } from 'react-chat-engine-advanced';
import { WebsocketContext } from '../context/websocket.context';
import '../pages/Chat.css';
import decodeToken from '../helpers/helpers';
import { Socket } from 'socket.io-client';


interface User{
	id:number,
	login42: string,
	username: string,
	avatar: string,
	isAdmin: boolean,
}

interface FUCKLINTERFACESAMERE{
	chatData: chatData | undefined ;
	user_id: number | undefined;
	socket: Socket;
}

interface MultipleUsersInter{
	members: User[];
	token: string | undefined,
	chat: chatData | undefined,
	socket: Socket,
}

interface OneUserInter{
	user: User;
}

//const [selectedUser, setSelectedUser] = useState('');

const handleAddUser = (user: User) => {
	// Implement logic to add the user to your contact list or perform the desired action.
	// This could involve making an API request to your server.
	console.log(`Adding user: ${user.username}`);
  };

  const handleBlockUser = (user: User) => {
	// Implement logic to block the user or perform the desired action.
	// This could involve making an API request to your server.
	console.log(`Blocking user: ${user.username}`);
};

const invitePong = (user: User) => {
	//const navigate = useNavigate();
	// Implement logic to block the user or perform the desired action.
	// This could involve making an API request to your server.
	//setSelectedUser(username);
	console.log(`Inviting ${user.username} for a game`);
	//navigate('/Game');
};

const adminUser = async (chat: chatData|undefined, user: User, token: string|undefined) => {
	let way: string = user.isAdmin == true ? 'unadmin' : 'admin';
	console.log(`setting user ${user.username} as ${way} `);
	if (chat == undefined)
		return;
	let content: {username: string, user: number, avatar: string};
	if (token != undefined)
	{
		content = decodeToken(token);
	}
	else
		return;
	const response = await fetch(`http://localhost:8080/api/chats/${chat.chat_id}/users/${way}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify({user_id: user.id, requester: content?.user})
		});
		const data = await response.json();
};

	const deleteChannel = async (chat: chatData|undefined, socket: Socket) => {
		if (chat == undefined)
			return;
		console.log('message: ', {chat_id: chat.chat_id, roomName: chat.chat.name});
		socket.emit("delete-channel", {chat_id: chat.chat_id, roomName: chat.chat.name});
	};

const IdChatUser: React.FC<FUCKLINTERFACESAMERE> = ({ chatData, user_id, socket }: FUCKLINTERFACESAMERE) => {
	const token = Cookies.get('token');
	const [chatMembers, setchatMembers] = useState<User[]>()
	const [fetched, setFetched] = useState<boolean>(false);
	const ChatType: number = 0;
	const navigate = useNavigate();

	useEffect(() => {
		socket.connect();
		if (chatData) {
			getData(chatData);
		}
	}, [chatData]);

	useEffect(() => {
		socket.on("smb-moved", () =>{
		console.log(">>smb joined<<")
		if (chatData) {
			getData(chatData);
		}
		});

		socket.on("deleted", () =>{
			socket.emit("leave-room", {id : chatData?.id, roomName : chatData?.chat.name});
		})
		return() => {
			socket.off("smb-moved");
			socket.off("deleted");
		}
	}, [socket, chatMembers]);


	const goToProfile = (user: User) => {
		navigate(`/profiles/${user.username}`);
	};

	async function getData (chatData: chatData|undefined) {
		setFetched(false);
		console.log('user_id', user_id);
		console.log('chatData: ',chatData);
		if (chatData === undefined)
		{
			setchatMembers([]);
			return;
		}
		const response = await fetch(`http://localhost:8080/api/chats/${chatData.chat_id}/users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
		});
		if(response.ok)
		{
			const data = await response.json()
			setchatMembers(data)
			setFetched(true);
			console.log('members: ', data);
		}
		else
		{
			console.log("error in the get data")
			setchatMembers([]);
		}
	}

	return (
		<div>
			{fetched ? <div>
			{chatMembers.map((user: User) => (
			<li key={user.id} className= "friendslist" >
				<span className="messages" style={user.isAdmin == true ? {color: "green"} : {color: "red"}}>
					{user.username}
				</span>
				<Menu>
				<MenuButton className='sendButton' as={Button} rightIcon={<ChevronDownIcon />}>
					Actions
				</MenuButton>
				<MenuList>
					<MenuItem className='Addfriend' onClick={() => handleAddUser(user)}>Add as a friend</MenuItem>
					<MenuItem className='Addfriend' onClick={() => handleBlockUser(user)}> Block User </MenuItem>
					<MenuItem className='Addfriend' onClick={() => invitePong(user)}> Invite for a pong </MenuItem>
					<MenuItem className='Addfriend' onClick={() => adminUser(chatData, user, token)}> set User as Admin </MenuItem>
					<MenuItem className='Addfriend' onClick={() => goToProfile(user)}> See Profile </MenuItem>
				</MenuList>
				</Menu>
			</li>
		))} </div> : <div className="history_1">Loading...</div>}
		<button onClick={() => deleteChannel(chatData, socket)}>leave channel</button>
		</div>
	)
}

	export default IdChatUser;
