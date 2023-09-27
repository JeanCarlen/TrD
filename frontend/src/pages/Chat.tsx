import React, { useContext, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import { Avatar, AvatarBadge, AvatarGroup, CSSReset, useConst } from '@chakra-ui/react'
import {Wrap, WrapItem, Text} from '@chakra-ui/react'
import { avatarAnatomy } from '@chakra-ui/anatomy'
import { ChakraProvider } from '@chakra-ui/react'
import './Home.css'
import ChatInterface from '../chat/chatroom';
import './Chat.css'
import { useState } from 'react';
import OnlineUsersList from '../chat/onlineFriends';
import { WebsocketContext, socket } from '../context/websocket.context';

interface Friends {
	id: number;
	name: string;
	state: number;
  }

export function Chat() {
	const [value, setValue] = useState('');
	const [data, setData] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const socket = useContext(WebsocketContext);

	useEffect(() => {
		socket.on('connect', () => {
			console.log('connected')
		})
		socket.on('srv-message', (data) => {
			console.log(`srv-message ${data}`)
		});
		return () => {
			console.log('Unregistering events...')
			socket.off('connect')
			socket.off('srv-message')
		}
	}, [])

	function onSubmit(e: React.FormEvent) {
	  e.preventDefault();
	  socket.emit('create-something', value)
	}

	function connect(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		socket.connect()
		setIsLoading(false);
	}

	// socket.on('srv-message', (body) => console.log(body))
  
	return (
		<>
			<Sidebar />
			<p>{ data }</p>
			<button onClick={ connect } >Connect</button>
			<form onSubmit={ onSubmit }>
				<input onChange={ e => setValue(e.target.value) } />
		
				<button type="submit" disabled={ isLoading }>Submit</button>
			</form>
		</>
	);
  }
		// <div>
		// 	<ChatHome
		// 			username={username}
		// 			setUsername={setUsername}
		// 			room={room}
		// 			setRoom={setRoom}
		// 			socket={socket}
		// 			/>
		// 	<ChatRoom username={username} room={room} socket={socket} />
		// </div>
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

// <ChakraProvider resetCSS={false}>
// <Wrap>
// 			<WrapItem>
// 			<Avatar size='sm'name='Dan Abrahmov' src='https://bit.ly/dan-abramov'>
// 			<AvatarBadge borderColor='green.600' boxSize='0.8em' bg='green.600'>
// 			</AvatarBadge>
// 			</Avatar>
// 			</WrapItem>
// 			<WrapItem>
//     		<Avatar size='sm' src='htps://bit.ly/kent-c-dodds'>
// 			<AvatarBadge borderColor='red' bg='red' boxSize='0.8em'/>
// 			</Avatar>
//  	 		</WrapItem>
// 			</Wrap>
// 		</ChakraProvider>
