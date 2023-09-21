import React, { useContext, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import { Avatar, AvatarBadge, AvatarGroup, CSSReset, useConst } from '@chakra-ui/react'
import {Wrap, WrapItem, Text} from '@chakra-ui/react'
import { avatarAnatomy } from '@chakra-ui/anatomy'
import { ChakraProvider } from '@chakra-ui/react'
import './Home.css'
import './Chat.css'
import { useState } from 'react';
import IdChatUser from '../chat/idChatUser';
import ChatInterface from '../chat/ChatInterface';

export interface Friends {
	id: number;
	name: string;
	state: number;
  }

export function Chat() {
	const [friends, setFriends] = useState<Friends[]>([]);
	const [friendsName, setFriendsName] = useState<string>('');

	const handleFriends = () => {
	const newFriend: Friends = {
		id:friends.length + 1,
		name: friendsName,
		state: 1,
	};

	setFriends([...friends, newFriend]);
		setFriendsName('');
	};

	return (
		<div>
			<Sidebar/>
		<div className='HomeText'>
			Chat
		</div>
		<div className='grid'>
			<div className="leftColumn">
			{friends.map((friend) => (
			<div
				key={friend.id}
				className={`friendBubble ${
				friend.state === 1 ? 'online' : 'offline'
				}`}
			>
				{friend.name}
			</div>
			))}
			<div className="message-input">
			<input className='messages'
			type="text"
			placeholder="TFriend name"
			value={friendsName}
			onChange={(e) => setFriendsName(e.target.value)}
			/>
			<button className="sendButton"
			onClick={handleFriends}>ADD</button>
			</div>
			</div>
			<div className="middleColumn">
				<ChatInterface/>
			</div>
			<div className="rightColumn">
				<IdChatUser Idduchat={2} ChatType={0}/>
			</div>
		</div>
		</div>
	);
}

{/* <p>{ data }</p>
			<button onClick={ connect } >Connect</button>
			<form onSubmit={ onSubmit }>
				<input onChange={ e => setValue(e.target.value) } />
		
				<button type="submit" disabled={ isLoading }>Submit</button>
			</form> */}


	// 	<div>
    //         <Sidebar/>
	// 	<div className='HomeText'>
	// 		Chat
	// 	</div>
	// 	<div className='grid'>
	// 		<div className="leftColumn">
	// 		{friends.map((friend) => (
	// 		<div
	// 			key={friend.id}
	// 			className={`friendBubble ${
	// 			friend.state === 1 ? 'online' : 'offline'
	// 			}`}
	// 		>
	// 			{friend.name}
	// 		</div>
	// 		))}
	// 		<div className="message-input">
    //     	<input className='messages'
	// 		type="text"
	// 		placeholder="TFriend name"
	// 		value={friendsName}
	// 		onChange={(e) => setFriendsName(e.target.value)}
    //     	/>
	// 		<button className="sendButton"
	// 		onClick={handleFriends}>ADD</button>
	// 		</div>
	// 		</div>
	// 		<div className="middleColumn">
	// 			<ChatInterface/>
	// 		</div>
	// 		<div className="rightColumn">
	// 			<OnlineUsersList/>
	// 		</div>
	// 	</div>
	// 	</div>
	// )
// }


// const Chat: React.FunctionComponent = () => {
// 	const [friends, setFriends] = useState<Friends[]>([]);
// 	const [friendsName, setFriendsName] = useState<string>('');

// 	const socket: Socket = io('ws://localhost:8080',{ path:'/api'});
// 	// const [username, setUsername] = useState('');
// 	// const [room, setRoom] = useState('');
// 	console.log("at the start the socket is ", socket);
// 	data.socket = socket;

// const handleFriends = () => {
// 	const newFriend: Friends = {
// 		id:friends.length + 1,
// 		name: friendsName,
// 		state: 1,

// 	};
// 	setFriends([...friends, newFriend]);
//     setFriendsName('');
// };
