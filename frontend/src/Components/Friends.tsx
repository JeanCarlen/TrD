import { Text, List, ListItem, Flex} from '@chakra-ui/react'
import { useState} from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import '../pages/Users.css'
import '../pages/Home.css'
import '../pages/Stats.css'
import { useEffect } from 'react';
import React from 'react';
import decodeToken from '../helpers/helpers';
import { WrapItem, Wrap} from '@chakra-ui/react'
import { Avatar} from '@chakra-ui/react'
import ShowStatus from './FriendStatus';
import { VStack } from '@chakra-ui/react';

export interface FriendData{
	requester: string;
	status: number; 
	id: number;
	requester_user: string;
	requested_user: string;
	username: string;
	curr_status: string;
	avatar: string;
}

const FriendList: React.FC<{}> = () => {
	const token = Cookies.get('token');
	const [isSender, setIsSender] = useState<boolean | null>(null);
	const [friends, setFriends] = useState<FriendData[]>([]);
	let content: {username: string, user: number, avatar: string};
    if (token !== undefined)
      content = decodeToken(token);
    else
      content = { username: 'default', user: 0, avatar: 'http://localhost:8080/images/default.png'}

	const getFriends = async() => {
		const response = await fetch(`http://localhost:8080/api/friends/active/list/${content.user}`,
			{ method: 'GET',
				headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
				},
				});
			const data = await response.json()
			if (response.ok)
			{
				console.log("friendlist", data);
				setFriends(data);
				if (data[0] !== undefined)
					setIsSender(content.username === data[0].requester_user.username);
			}
	}

	useEffect(() =>{
		getFriends();
	}, []);
	
	return (
		<div>
		<h2>Friends</h2>
		<List className='friends-list'>
        {friends.map((friend) => (
          <ListItem key={friend.requester}>
            <Flex display="flex" alignItems="center">
              		{isSender ? (
					<Wrap>
					<WrapItem className='profile-border'>
					<VStack spacing={4} alignItems="center">
						<Link to={`/profiles/${friend.requested_user?.username}`}>
						<Avatar size="xs" src={friend.requested_user?.avatar}/>
						<ShowStatus status={friend.requested_user?.curr_status}/>
						<Text display="flex">{friend.requested_user?.username}</Text>
						</Link>
					</VStack>
					</WrapItem>
					</Wrap>
				) : (
					<Wrap>
					<WrapItem className='profile-border'>
					<VStack spacing={4} alignItems="center">
						<Link to={`/profiles/${friend.requester_user?.username}`}>
						<Avatar size="xs" src={friend.requester_user?.avatar}/>
						<ShowStatus status={friend.requester_user?.curr_status}/>
						<Text display="flex">{friend.requester_user?.username}</Text>
						</Link>
					</VStack>
					</WrapItem>
					</Wrap>
				)}
            </Flex>
          </ListItem>
        ))}
		</List>
		</div>
	)
};

export default FriendList;
