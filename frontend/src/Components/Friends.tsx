import { Text, List, ListItem, Flex, Input,
Stack, Button, InputGroup, InputRightElement } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client';
import { useState} from 'react';
import Cookies from 'js-cookie';
import '../pages/Users.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import '../pages/Home.css'
import { Icon, createIcon } from '@chakra-ui/react'
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import decodeToken from '../helpers/helpers';
import '../pages/Stats.css'
import { ChakraProvider, WrapItem, Wrap, CSSReset} from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import {
    extendTheme,
    VStack,
    HStack,
    IconButton,
} from '@chakra-ui/react';
import '../pages/Home.css';
import ShowStatus from './Status';

export interface FriendData{
	requester: string;
	status: string;
	id: number;
}

const FriendList: React.FC<{}> = () => {
	const token = Cookies.get('token');
	const [isSender, setIsSender] = useState<boolean | null>(null);
	const [status, setStatus] = useState<string>('');
	let content: {username: string, user: number, avatar: string};
    if (token != undefined)
      content = decodeToken(token);
    else
      content = { username: 'default', user: 0, avatar: 'http://localhost:8080/images/default.png'}
	const [friends, setFriends] = useState<FriendData[]>([]);

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
				setStatus('online');
				if (data[0] != undefined)
					setIsSender(content.username === data[0].requester_user.username);
			}
	}

	useEffect(() =>{
		const token: string|undefined = Cookies.get("token");
		const delay = 2000;

		let content: {username: string, user: number};
		if (token != undefined)
		{
			content = decodeToken(token);
		}
		else
		content = { username: 'default', user: 0};
	// setContent(content);
		getFriends();

	}, []);
	
	return (
		<div>
		<h2>Friends</h2>
		<List className='friends-list'>
        {friends.map((friend) => (
          <ListItem key={friend.requester}>
            <Flex alignItems="center">
              {friend.status === 'online' ? (
				<div className='icon-container'>
				<div className='status-circle-online'>
					<ShowStatus/>
				</div>
				</div>
                // <CheckCircleIcon boxSize={6} color="green.500" />
              ) : (
				<div className='icon-container'>
					<div className='status-circle-offline'>
					<ShowStatus/>
					</div>
					</div>
                // <Icon boxSize={6} color='red.500'/>
              )}
              	{isSender ? (
					  <Wrap>
					<WrapItem className='profile-border'>
					<VStack spacing={4} alignItems="center">
						 <Link to={`/profiles/${friend.requested_user.username}`}>
					<Avatar
					size="xs"
					src={friend.requested_user.avatar}
					/>
					<div className='icon-container'>
					<div className='status-circle'>
					</div>
					</div>
					<Text marginLeft="2">{friend.requested_user.username}</Text>
					</Link>
					</VStack>
					</WrapItem>
					</Wrap>
				) : (
					<Wrap>
					<WrapItem className='profile-border'>
					<VStack spacing={4} alignItems="center">
						 <Link to={`/profiles/${friend.requester_user.username}`}>
					<Avatar
					size="xs"
					src={friend.requester_user.avatar}
					/>
					<div className='icon-container'>
					<div className='status-circle'>
					</div>
					</div>
					<Text marginLeft="2">{friend.requester_user.username}</Text>
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
