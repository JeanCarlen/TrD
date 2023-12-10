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

type UserInfo = {
	avatar: string;
	status: number;
	curr_status:number;
	login42: string;
	username: string;
}

export interface FriendData{
	friends: number;
	id: number;
	requested: number;
	requested_user: UserInfo;
	requester: number;
	requester_user: UserInfo;
	status: number;
	total_count: number;
}

const FriendList: React.FC<{}> = () => {
	const token = Cookies.get('token');
	const [isSender, setIsSender] = useState<boolean | null>(null);
	const [friends, setFriends] = useState<FriendData[]>([]);
	const [friendsinfo, setFriendsInfo] = useState<UserInfo[]>([]);
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
			}
	}
	const filteredFriendships = friends.filter(
		(friends) => friends.requester_user.username === content.username || friends.requested_user.username === content.username
	  );
	  
	  const friendList = filteredFriendships.map((friends) => {
		const friendName = friends.requester_user.username === content.username ? friends.requested_user.username : friends.requester_user.username;
		return (
			<div key={friendName}>
         	 <ListItem>
           	 <Flex display="flex" alignItems="center">
					<Wrap>
					<WrapItem className='profile-border'>
					<VStack spacing={4} alignItems="center">
						<Link to={`/profiles/${friendName}`}>
						<Text display="flex">{friendName}</Text>
						</Link>
					</VStack>
					</WrapItem>
					</Wrap>
            </Flex>
          </ListItem>
			</div>
		  );
	  });

	useEffect(() =>{
		getFriends();
	}, []);

	useEffect(() => {
		const fetchFriendsDetails = async () => {
		  const friendsData: UserInfo[] = await Promise.all(
			friends.map(async (friends) => {
			  const friendId = friends.requester === content.user ? friends.requested : friends.requester;
				const friendDetails = await fetch(`http://localhost:8080/api/users/${friendId}`,
				{ method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
					},
				});
			  return friendDetails.json();
			})
		  );
		  setFriendsInfo(friendsData);
		  console.log("friendsData", friendsData);
		};
		if (content.user !== null)
			fetchFriendsDetails();
	  }, [content.user, friends]);
	
	return (
		<div>
		<h2>Friends</h2>
		<List className='friends-list'>
			<div>
			{friendsinfo.map((friend) => (
			<ListItem key={friend.username}>
			<Flex display="flex" alignItems="center">
			<Wrap>
					<WrapItem className='profile-border'>
					<VStack spacing={4} alignItems="center">
						<Link to={`/profiles/${friend.username}`}>
						<Avatar size="xs" src={friend.avatar}/>
						<ShowStatus status={friend.status}/>
						<Text display="flex">{friend.username}</Text>
						</Link>
					</VStack>
					</WrapItem>
					</Wrap>
			</Flex>
			</ListItem>
      	))}
		</div>
		</List>
		</div>
	)
};

export default FriendList;
function async(friends: FriendData[]): (value: FriendData, index: number, array: FriendData[]) => FriendData {
	throw new Error('Function not implemented.');
}

