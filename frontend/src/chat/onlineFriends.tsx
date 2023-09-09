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

const OnlineUsersList: React.FC = () => {

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

	const [onlineUsers, setOnlineUsers] = useState([{
		name: 'Jean',
		status: 'online',
		},
		{
		name: 'Fabio',
		status: 'offline',

		}
	])

	// useEffect(() => {
	// 	const socket = new WebSocket('ws://example.com/online-users'); // Replace with your WebSocket server URL

	// 	socket.onmessage = (event) => {
	// 	  const { type, username } = JSON.parse(event.data);

	// 	  if (type === 'user_online') {
	// 		setOnlineUsers((prevOnlineUsers) => [...prevOnlineUsers, username]);
	// 	  } else if (type === 'user_offline') {
	// 		setOnlineUsers((prevOnlineUsers) =>
	// 		  prevOnlineUsers.filter((user) => user !== username)
	// 		);
	// 	  }
	// 	};
	// 	return () => {
	// 		socket.close();
	// 	  };
	// 	}, []);

		return (
		  <div className='chat-interface'>
			<h2>Online Users</h2>
			<ul>
			{onlineUsers.map((user) => (
				<li key="{user.name}" className={`friendslist ${user.status === 'online' ? 'online' : 'offline'}`} >
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
					</MenuList>
					</Menu>
			</li>
        ))}
		</ul>
		  </div>
		);
	  };

	  export default OnlineUsersList;
