import React, { useEffect, useState } from 'react';
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

interface User{
	name: string;
	status: number;
	isWriting: number;
}

interface FUCKLINTERFACESAMERE{
	Idduchat: number;
	ChatType: number;
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

const IdChatUser: React.FC<FUCKLINTERFACESAMERE> = ({ Idduchat, ChatType }) => {
	const token = Cookies.get('token');

	async function GetData (Idduchat: number) {
		const response = await fetch(`http://localhost:8080/api/chats/${Idduchat}/users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer' + token
			},
		});
		const data = await response.json()
		return (data);
	}

	const [chatMembers, setchatMembers] = useState<User[]>([
		{
		name: 'Jean',
		status: 1,
		isWriting: 0,
		},
		{
		name: 'Fabio',
		status: 1,
		isWriting: 0,
		},
		{
		name: 'Nikki',
		status: 1,
		isWriting: 0,
		}
		
	])

	if (ChatType === 0)
	{
		return (
			<div className='chat-interface'>
				<h2>Online Users</h2>
			<ul>
				<MultipleUsers members={chatMembers}/>
			</ul>
			</div>
		);
	}
	else if (ChatType === 1)
	{
		return (
			<div className='chat-interface'>
				<h2>Online Users</h2>	
			<ul>
				<OnlyOneUser user={chatMembers[0]}/>
			</ul>
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
			{members.map((user) => (
			<li key="{user.name}" className={`friendslist ${user.status === 1 ? 1 : 0}`} >
				<span className="messages">
					{user.name}
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
