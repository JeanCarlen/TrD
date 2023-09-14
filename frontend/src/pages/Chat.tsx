import React from 'react';
import Sidebar from '../Components/Sidebar';
import { Avatar, AvatarBadge, AvatarGroup, CSSReset } from '@chakra-ui/react'
import {Wrap, WrapItem, Text} from '@chakra-ui/react'
import { avatarAnatomy } from '@chakra-ui/anatomy'
import { ChakraProvider } from '@chakra-ui/react'
import './Home.css'
import ChatInterface from '../chat/chatroom';
import './Chat.css'
import { useState } from 'react';
import OnlineUsersList from '../chat/onlineFriends';

interface Friends {
	id: number;
	name: string;
	state: number;
  }

const Chat: React.FunctionComponent = () => {
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

}

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
				<OnlineUsersList/>
			</div>
		</div>
		</div>
	)
}

export default Chat

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
