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
			  setIsSender(users === data1[0].requester_user.username);
		  }
		  console.log("data1", data1);
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
              {friend.status === 'online' ? (
                <CheckCircleIcon boxSize={6} color="green.500" />
              ) : (
                <Icon boxSize={6} color='red.500'/>
              )}
			{isSender ? (
				<Link to={`/profiles/${friend.requested_user.username}`}>
					<Text marginLeft="2">{friend.requested_user.username}</Text>
				</Link>
				) : (
				<Link to={`/profiles/${friend.requester_user.username}`}>
					<Text marginLeft="2">{friend.requester_user.username}</Text>
				</Link>
				)}
            </Flex>
          </ListItem>
        ))}
		</List>
	  </div>
	)
};

export default FriendListProfile;
