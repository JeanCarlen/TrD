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
import { useParams } from 'react-router-dom';
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
import ShowStatus from './FriendStatus';

export interface FriendData{
	requester: string;
	status: string;
	id: number;
	friendid: number;
}

const FriendListProfile: React.FC<FriendData> = ({friend}) => {
	const {users} = useParams();
	const [friends, setFriends] = useState<FriendData[]>([]);
	const [isSender, setIsSender] = useState<boolean | null>(null);
	const token = Cookies.get('token');
	let content: {username: string, user: number, avatar: string};
    if (token != undefined)
	content = decodeToken(token);
    else
      content = { username: 'default', user: 0, avatar: 'http://localhost:8080/images/default.png'}
	// const [friends, setFriends] = useState<FriendData[]>([]);
	
	const GetUserinfo = async () => {
		const response = await fetch(`http://localhost:8080/api/users/username/${users}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		});
		const data = await response.json()
		if (response.ok)
		{
			console.log("friend page", data);
			//   setAvatarUrl(data[0].avatar);
			//   setFriendID(data[0].id);
			//   fetchMatches(data[0].id);
		}
		console.log ('data', data);
		let content: {username: string, user: number};
		if (token != undefined)
		{
		  content = decodeToken(token);
		}
		else
		{
			content = { username: 'default', user: 0};
		}
		const response1 = await fetch(`http://localhost:8080/api/friends/active/list/${data[0].id}`,
		{ method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
		},
	}); 
	const data1 = await response1.json()
	if (response1.ok)
		  {
			  console.log("friendlist", data1);
			  setFriends(data1);
			  if (data1[0] != undefined)
			 	 setIsSender(content.username === data1[0].requested_user.username);}
	  }
	  
	  useEffect(() =>{
		console.log("friends in Profile", friends);
		const token: string|undefined = Cookies.get("token");
		let content: {username: string, user: number};
		  if (token != undefined)
		  {
			content = decodeToken(token);
		  }
		  else
			content = { username: 'default', user: 0};
		  GetUserinfo();
	  }, []);

	  if (isSender === null) {
		// Loading state, you might display a loading spinner or message
		return <p>Loading...</p>;
	  }

	return (
		<div>
		<h2>Friends</h2>
		<List className='friends'>
        {friends.map((friend) => (
          <ListItem key={friend.requester}>
            <Flex alignItems="center">
			{isSender ? (
					<Wrap>
					<WrapItem className='profile-border'>
					<VStack spacing={4} alignItems="center">
						<Link to={`/profiles/${friend.requested_user.username}`}>
						<Avatar size="xs" src={friend.requested_user.avatar}/>
						<ShowStatus status={friend.requested_user.curr_status}/>
						<Text display="flex">{friend.requested_user.username}</Text>
						</Link>
					</VStack>
					</WrapItem>
					</Wrap>
				) : (
					<Wrap>
					<WrapItem className='profile-border'>
					<VStack spacing={4} alignItems="center">
						<Link to={`/profiles/${friend.requester_user.username}`}>
						<Avatar size="xs" src={friend.requester_user.avatar}/>
						<ShowStatus status={friend.requester_user.curr_status}/>
						<Text display="flex">{friend.requester_user.username}</Text>
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

export default FriendListProfile;
