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
import '../pages/Chat.css'

interface User{
	id: number;
	user_id: number;
	chat_id: number;
	chat_name: string;
	name: string;
	status: number;
	isWriting: number;
}

interface FUCKLINTERFACESAMERE{
	chatData: chatData | undefined ;
	user_id: number | undefined;
}

interface MultipleUsersInter{
	members: User[];
}

interface OneUserInter{
	user: User;
}

//const [selectedUser, setSelectedUser] = useState('');

const handleAddUser = (username: string) => {
	// Implement logic to add the user to your contact list or perform the desired action.
	// This could involve making an API request to your server.
	console.log(`Adding user: ${username}`);
  };

  const handleBlockUser = (username: string) => {
	// Implement logic to block the user or perform the desired action.
	// This could involve making an API request to your server.
	console.log(`Blocking user: ${username}`);
};

const invitePong = (username: string) => {
	//const navigate = useNavigate();
	// Implement logic to block the user or perform the desired action.
	// This could involve making an API request to your server.
	//setSelectedUser(username);
	console.log(`Inviting ${username} for a game`);
	//navigate('/Game');
};

const muteUser = async (username: string) => {
	console.log(`Muting user: ${username}`);
	

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
		console.log(print);
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
					{chatMembers && <MultipleUsers members={chatMembers} />}
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
					{user.name}
			</span>
		</div>
	)
};

const MultipleUsers: React.FC<MultipleUsersInter> = ({members}) => {
	return (
		<div>
			{members.map((user: User) => (
			<li key={user.id} className= "friendslist" >
				<span className="messages">
					{user.user_id}
				</span>
				<Menu>
				<MenuButton className='sendButton' as={Button} rightIcon={<ChevronDownIcon />}>
					Actions
				</MenuButton>
				<MenuList>
					<MenuItem className='Addfriend' onClick={() => handleAddUser(user.name)}>Add as a friend</MenuItem>
					<MenuItem className='Addfriend' onClick={() => handleBlockUser(user.name)}> Block User </MenuItem>
					<MenuItem className='Addfriend' onClick={() => invitePong(user.name)}> Invite for a pong </MenuItem>
				</MenuList>
				</Menu>
			</li>
		))}
		</div>
	)
};

	export default IdChatUser;
