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

export interface FriendData{
	requester: string;
	status: string;
	id: number;
}

const FriendList: React.FC<{}> = () => {
	const token = Cookies.get('token');
	const [friends, setFriends] = useState<FriendData[]>([]);
	useEffect(() => {
	async function fetchData() {
	const response = await fetch('http://localhost:8080/api/friends',
		{ method: 'GET',
			headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
			},
			});
		const data = await response.json()
		if (response.ok)
		{
			console.log(data);
			setFriends(data);
		}
	}})


	return (
		<div>
		<h2>Friends</h2>
		<List className='friends'>
        {friends.map((friend) => (
          <ListItem key={friend.requester}>
            <Flex alignItems="center">
              {friend.status === 'online' ? (
                <CheckCircleIcon color="green.500" />
              ) : (
                <Icon viewBox='200' color='red.500'/>
              )}
              	<Link to={`/profiles/${friend.requester}`}>
                <Text marginLeft="2">{friend.requester}</Text>
              </Link>
            </Flex>
          </ListItem>
        ))}
		</List>
	  </div>
	)
};

export default FriendList;
