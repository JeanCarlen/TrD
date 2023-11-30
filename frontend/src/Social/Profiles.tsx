import React from 'react'
// import styled from 'styled-components'
import { ChakraProvider, WrapItem, Wrap, CSSReset} from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import Sidebar from '../Components/Sidebar'
import '../pages/Home.css'
import {
	extendTheme,
	VStack,
	HStack,
	IconButton,
	Input,
	Text,
} from '@chakra-ui/react';
import AvatarUpload from '../Components/AvatarUpload'
import { useState, useEffect} from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { useRef } from 'react'
import RegisterButton from '../LoginForm/RegisterButton'
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import Searchbar from '../Components/Searchbar'
import Cookies from 'js-cookie'
import decodeToken from '../helpers/helpers'
import { useParams } from 'react-router-dom';
import handleAddFriend from '../Components/AddFriend'
import UserInformation from '../Components/UserInformation'
import AddFriend from '../Components/AddFriend'
import {gameData} from '../pages/Stats'
import LayoutGamestats from '../pages/Layout-gamestats'
import FriendListProfile from '../Components/FriendlistOther'
import { handleBlockUser } from '../chat/idChatUser'
import * as FaIcons from 'react-icons/fa'
import { ToastContainer } from 'react-toastify';
import {User} from '../chat/idChatUser'
import { useNavigate } from 'react-router-dom';
import {gsocket, WebsocketContext } from "../context/websocket.context";

export interface profiles {
username: string | undefined;
}
type Props = {}

export interface FriendData{
requester: string;
status: string;
id: number;
}
const Profiles = (props: Props) => {
const {users} = useParams();
const token: string|undefined = Cookies.get("token");
const [gameFetched, setGameFetched] = useState<boolean>(false);
const [dataMatches, setDataMatches] = useState<gameData[]>([]);
const [avatarUrl, setAvatarUrl] = useState<string>();
const [achievementName, setAchievementName] = useState<string>('');
//   const [friendid, setFriendID] = useState<number>();
const [friends, setFriends] = useState<FriendData[]>([]);
const fileInputRef = useRef<HTMLInputElement | null>(null);
const [friendid, setFriendID] = useState<number|undefined>();
const [friend, setFriend] = useState<User>();
const navigate = useNavigate();
// 	const fileInputRef = useRef<HTMLInputElement | null>(null);

useEffect(() =>{
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number, avatar: string};
	if (token != undefined)
	{
		content = decodeToken(token);
	}
	else
		content = { username: 'default', user: 0, avatar: 'http://localhost:8080/images/default.png'};
	
	
	GetUserinfo();
	fetchMatches(content.user);
	}, []);
	
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
		setAvatarUrl(data[0].avatar);
		await setFriendID(data[0].id);
		console.log ('friendid', data.id);
		setFriend(data[0]);
		await fetchMatches(data[0].id);
		console.log("avatar", avatarUrl);
		}
	}
//   }}, []);

	//   let content: {username: string, user: number};
	//   if (token != undefined)
	//   {
	//     content = decodeToken(token);
	//   }
	//   else
	//   {
	//     content = { username: 'default', user: 0};
	// }
	
const fetchMatches = async (theID:number) => {
	console.log("Fetching matches for user", theID);
	const response = await fetch(`http://localhost:8080/api/matches/users/${theID}`, {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + token,
	},
	});
	if (response.ok)
	{
	try {
		let data = await response.json();
		data.sort((a: gameData, b: gameData) => (a.id > b.id) ? 1 : -1);
		setGameFetched(true);
		console.log("Data fetched", data);
		setDataMatches(data.slice(-3).reverse());
	}
	catch (e) {
		console.log("Error in response", e);
	}
	}
	else
	{
	console.log("Error fetching matches");
	}
}

function SpectateGame (user: User)
{
	if(token !== undefined)
		let content = decodeToken(token);
	try
	{
		if(content.user !== user.id)
		{
		gsocket.emit('give-roomName', {user_id: user.id});
		console.log('spectate game :', user.id);
		navigate('/game');
		}
	}
	catch (error)
	{
		console.log(error);
	}
}

	return (
	<ChakraProvider resetCSS={false}>
		<Searchbar/>
		<div>
		<Sidebar/>
		<div>
		<div className='topBox'>
		<Wrap>
			<WrapItem className='profile-border'>
			<VStack spacing={4} alignItems="center">
			<Avatar
			size="2xl"
			src={avatarUrl}/>
			</VStack>
			<h1 className="welcome"> {users} </h1>
			</WrapItem>
			</Wrap>
			<div className='profile-border'>
		<AddFriend userID={friendid}/>
		Add {users} as a friend
			</div>
			<div className='profile-border'>
			Invite {users} for a game
			</div>
	<div className='profile-border'>
		<FaIcons.FaHandPaper cursor='pointer' style={{marginLeft: '5px', fontSize: '30pt'}} onClick={() => handleBlockUser(friend, token)}/><br/>
		Block {users}
	</div>
		</div>
		<div className='displayGrid'>
			<div className='matchHistory'>
				match history<br/>
		{gameFetched ? 
		<div className='matchBox'>
		{dataMatches.map((stat: gameData) => {
		return (
			<LayoutGamestats display={stat} userID={friendid}/>
		);
		})}
		</div>
		: <div className='history_1' style={{fontSize:"25px"}}>Loading...</div>
		}
			</div>
			<div className='achievements'>
				{achievementName}
			</div>
			<div className='friends'>
				<div className='matchBox'>
				<FriendListProfile FriendData={friends}/>
				</div>
			</div>
			</div>
		</div>
	<ToastContainer/>
		</div>
		</ChakraProvider>
)
}

export default Profiles;
