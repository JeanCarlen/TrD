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


interface User{
	id:number,
	login42: string,
	username: string,
	avatar: string,
}

interface FUCKLINTERFACESAMERE{
	chatData: chatData | undefined ;
	user_id: number | undefined;
}

interface MultipleUsersInter{
	members: User[];
	token: string | undefined,
	chat: chatData | undefined,
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

const muteUser = async (chat: chatData|undefined, user: User, token: string|undefined) => {
	console.log(`Muting user: ${user.username}`);
	if (chat == undefined)
		return;
	let content: {username: string, user: number, avatar: string};
	if (token != undefined)
	{
		content = decodeToken(token);
	}
	else
		return;
	const response = await fetch(`http://localhost:8080/api/${chat.chat_id}/users/admin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify({user_id: user.id, requester: content?.user})
		});
		const data = await response.json()
		console.log(data);
};

const IdChatUser: React.FC<FUCKLINTERFACESAMERE> = ({ chatData, user_id }) => {
	const token = Cookies.get('token');
	const socket = useContext(WebsocketContext);
	const [chatMembers, setchatMembers] = useState<User[]>()
	const ChatType: number = 0;
	


	useEffect(() => {
		socket.connect();
		if (chatData) {
			getData(chatData);
		}
	}, [chatData]);

	async function getData (chatData: chatData) {
		console.log('user_id', user_id);
		const response = await fetch(`http://localhost:8080/api/chats/${chatData.chat_id}/users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
		});
		const data = await response.json()
		const print = JSON.stringify(data);
		console.log("user list data = ", data);
//		console.log(print);
		if(response.ok)
		{
			setchatMembers(data)
		}
		else
			console.log("error in the get data")
	}

	

	if (ChatType === 0)
	{
		return (
			<div className='chat-interface'>
				<h2>Online Users</h2>
				<ul>
					{chatMembers && <MultipleUsers chat={chatData} members={chatMembers} token={token}/>}
				</ul>
			</div>
		);
	}
	else if (ChatType === 1)
	if (Array.isArray(chatMembers) && chatMembers.length > 0) {
		return (
			<div className='chat-interface'>
				<h2>Online Users</h2>	
				<ul>
					<OnlyOneUser user={chatMembers[0]}/>
				</ul>
			</div>
		);
	} else {
		return (
			<div className='chat-interface'>
				<h2>Online Users</h2>
				<div>No users online</div>
			</div>
		);
	}
	else
	{
		return (
			<div className='chat-interface'>
			I don't know what you did, but somehow you broke our stuff!
			</div>
		)
	}
};

const OnlyOneUser: React.FC<OneUserInter> = ({user}) => {

	return (
		<div>
			<span className="messages">
					{user.username}
			</span>
		</div>
	)
};

const MultipleUsers: React.FC<MultipleUsersInter> = ({chat, members, token}) => {
	return (
		<div>
			{members.map((user: User) => (
			<li key={user.id} className= "friendslist" >
				<span className="messages">
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
					<MenuItem className='Addfriend' onClick={() => muteUser(chat, user, token)}> set User as Admin </MenuItem>
				</MenuList>
				</Menu>
			</li>
		))}
		</div>
	)
};

	export default IdChatUser;
