import React, { useContext, useEffect, useState } from 'react';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
	Button,
  } from '@chakra-ui/react'
import { ChevronDownIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import '../pages/LetsPlay'
import Cookies from 'js-cookie';
import { chatData } from './Chat';
import '../pages/Chat.css';
import decodeToken from '../helpers/helpers';
import { Socket } from 'socket.io-client';
import {toast, ToastContainer } from 'react-toastify';
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import {ChakraProvider, WrapItem, Wrap, CSSReset} from '@chakra-ui/react'
import './ChatInterface.css'
import * as FaIcons from 'react-icons/fa'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from "@chakra-ui/react";
import ShowStatus from '../Components/FriendStatus';


export interface User{
	id:number,
	login42: string,
	username: string,
	avatar: string,
	isAdmin?: boolean,
	isMuted?: boolean,
	isOwner?: boolean,
	status: number
}

interface IdChatProps{
	chatData: chatData | undefined ;
	user_id: number | undefined;
	socket: Socket;
}

interface MultipleUsersInter{
	members: User[];
	token: string | undefined,
	chat: chatData | undefined,
	socket: Socket,
}

interface OneUserInter{
	user: User;
}

//const [selectedUser, setSelectedUser] = useState('');

const handleAddUser = (user: User) => {
	// Implement logic to add the user to your contact list or perform the desired action.
	// This could involve making an API request to your server.
	console.log(`Adding user: ${user.username}`);
  };

export  const handleBlockUser = async (user: User, token: string|undefined) => {
	console.log(`Blocking user: ${user.username}`);
	let content: {username: string, user: number, avatar: string};
	if (token != undefined)
		content = decodeToken(token);
	else
		return;
	const response = await fetch(`http://localhost:8080/api/users/block/${user.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify({user_id: user.id})
		});
		if (response.ok)
			toast.info(user.username + ' was successfully blocked', { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-info' });
		else 
			toast.error('Error: ' + response.status, { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-error' });
};

const invitePong = (user: User) => {
	//const navigate = useNavigate();
	// Implement logic to block the user or perform the desired action.
	// This could involve making an API request to your server.
	//setSelectedUser(username);
	console.log(`Inviting ${user.username} for a game`);
	//navigate('/Game');
};

const adminUser = async (chat: chatData|undefined, user: User, token: string|undefined, mode: string) => {
	let way: string = user.isAdmin == true ? 'unadmin' : 'admin';
	if (mode == 'admin')
		way = user.isAdmin == true ? 'unadmin' : 'admin';
	else if (mode == 'mute')
		way = user.isMuted == true ? 'unmute' : 'mute';
	else
		way = mode;
	console.log(`setting user ${user.username} as ${way} `);
	if (chat == undefined)
		return;
	let content: {username: string, user: number, avatar: string};
	if (token != undefined)
	{
		content = decodeToken(token);
	}
	else
		return;
	const response = await fetch(`http://localhost:8080/api/chats/${chat.chat_id}/users/${way}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify({user_id: user.id, requester: content?.user, })
		});
		if (response.ok)
			toast.info(user.username + ' was successfully ' + way, { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-info' });
		else 
			toast.error('Error: ' + response.status, { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-error' });
};

	const leaveRoom = (chat: chatData|undefined, socket: Socket) => {
		socket.emit('leave-chat', {chat_id: chat?.chat_id, roomName: chat?.chat.name, user_id: chat?.user_id});
	}

	const deleteChannel = async (chat: chatData|undefined, socket: Socket) => {
		if (chat == undefined)
			return;
		console.log('message: ', {chat_id: chat.chat_id, roomName: chat.chat.name});
		socket.emit("delete-channel", {chat_id: chat.chat_id, roomName: chat.chat.name});
	};

const IdChatUser: React.FC<IdChatProps> = ({ chatData, user_id, socket }: IdChatProps) => {
	const token = Cookies.get('token');
	const [chatMembers, setchatMembers] = useState<User[]>()
	const [fetched, setFetched] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<User>();
	const [bannedUsers, setBannedUsers] = useState<User[]>();
	const ChatType: number = 0;
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		// socket.connect();
		if (chatData) {
			getData(chatData);
		}
	}, [chatData]);

	useEffect(() => {
		socket.on("smb-moved", () =>{
		console.log(">>smb joined<<")
		if (chatData) {
			getData(chatData);
		}
		});

		// socket.on("deleted", () =>{
		// 	socket.emit("leave-room", {id : chatData?.id, roomName : chatData?.chat.name});
		// })

		socket.on('refresh-id', ()=>{
			getData(chatData);
		});

		return() => {
			socket.off("smb-moved");
			socket.off("deleted");
			socket.off("refresh-id");
		}
	}, [socket, chatMembers]);


	useEffect(()=>{
		chatMembers?.forEach((user: User) => {
			if (user.id === user_id)
			{
				setCurrentUser(user);
			}
		})
	},[chatMembers]);

	const setNewMode = async (user: User, mode: string) => {
		if (mode === 'ban')
		socket.emit('kick', {roomName: chatData?.chat.name, UserToKick: user.id});
		await adminUser(chatData, user, token, mode);
		socket.emit('refresh', {roomName: chatData?.chat.name, type: 'id'});
	};

	const goToProfile = (user: User) => {
		navigate(`/profiles/${user.username}`);
	};

	const changePassword = async () => {
		console.log('change password');
		let newPassword: string | undefined | null;
		newPassword = prompt('Enter new password, leave empty to remove password');
		if (newPassword === null || newPassword === undefined)
			return ;
		if (newPassword.trim() === '')
			newPassword = undefined;
		console.log('new password:', newPassword);
		if (chatData=== undefined)
			return;
		const response = await fetch(`http://localhost:8080/api/chats/${chatData.chat_id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			body: JSON.stringify({
				password: newPassword,
			})
		});
		if(response.ok)
		{
			toast.info('Password changed', { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-info' });
			socket.emit('refresh', {roomName: chatData.chat.name, type: 'chat'});
		}
		else
		{
			const error_data = await response.json();
			toast.error('Error: ' + response.status, { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-error' });
			console.log('error in the change password', error_data);
		}

	};

	async function unbanUsers () {
		const response = await fetch(`http://localhost:8080/api/chats/${chatData?.chat_id}/users/banned`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		});
		if (response.ok)
		{
			let bannedList = await response.json();
			console.log('banned list: ', bannedList);
			await setBannedUsers(bannedList);
			onOpen();
		}
	}

	async function doDeleteChannel () {
		const response = await fetch(`http://localhost:8080/api/chats/${chatData?.chat_id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		});
		let data = await response.json();
		if (response.ok)
		{
			console.log('deleted channel')
			socket.emit('delete-channel', {roomName: chatData?.chat.name});
		}
	}

	async function getData (chatData: chatData|undefined) {
		setFetched(false);
		console.log('user_id', user_id);
		console.log('chatData: ',chatData);
		if (chatData === undefined)
		{
			setchatMembers([]);
			return;
		}
		const response = await fetch(`http://localhost:8080/api/chats/${chatData.chat_id}/users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		});
		if(response.ok)
		{
			const data = await response.json()
			setchatMembers(data.sort((a: User, b: User) => a.username.localeCompare(b.username)));
			setFetched(true);
			console.log('members: ', data);
		}
		else
		{
			const data = await response.json()
			console.log("error in the get data", data);
			setchatMembers([]);
		}
	}

	const inviteToPong = async (user: User) => {
		let content = await decodeToken(token);
		socket.emit('invite', {inviter: content, invited: user});
	};

	return (
		<ChakraProvider>
		<div className="idUser">
			{fetched ? <div>
			{chatMembers.map((user: User) => (
			<li key={user.id} className="friendlist" >
				<WrapItem>
					<Avatar size='md' src={user.avatar} name={user.username}/>
					<ShowStatus status={user.status}/>
				</WrapItem>
				<div className="messages">
					{user.username}
					{user.isAdmin === true ? <FaIcons.FaCrown style={{marginLeft: '5px'}}/> : <></>}
					{user.isMuted === true ? <FaIcons.FaVolumeMute style={{marginLeft: '5px'}}/> : <></>}
				</div>
				<br/>
				<Menu>
				<MenuButton className='sendButton' as={Button} rightIcon={<ChevronDownIcon />}>
					Actions
				</MenuButton>
				<MenuList>
					<MenuItem className='Addfriend' onClick={() => handleAddUser(user)}>Add as a friend</MenuItem>
					<MenuItem className='Addfriend' onClick={() => handleBlockUser(user, token)}> Block User </MenuItem>
					<MenuItem className='Addfriend' onClick={() => inviteToPong(user)}> Invite for a pong </MenuItem>
					{currentUser?.isAdmin === true ? 
					<>
					<MenuItem className='Addfriend' onClick={() => setNewMode(user, 'admin')}> {user.isAdmin === true ? 'Remove user as Admin' : 'Set user as Admin'} </MenuItem>
					<MenuItem className='Addfriend' onClick={() => setNewMode(user, 'mute')}> {user.isMuted === true ? 'Unmute user' : 'Mute user'} </MenuItem>
					<MenuItem className='Addfriend' onClick={() => setNewMode(user, 'ban')}> Ban user </MenuItem>
					</>
					: <div></div>
					}
					<MenuItem className='Addfriend' onClick={() => goToProfile(user)}> See Profile </MenuItem>
				</MenuList>
				</Menu>
			</li>
			))}
			
			<>
			{currentUser?.isOwner === true ?
			<>
			<button className="sendButton" style={{marginBottom: '10px', marginTop: '10px'}} onClick={() => changePassword()}>Change Password</button>
			{/* <br/> */}
			<button className="sendButton" style={{marginBottom: '10px', marginTop: '10px'}} onClick={() => unbanUsers()}>Unban users </button>
			{/* <br/> */}
			<button className="sendButton" style={{marginBottom: '10px', marginTop: '10px'}} onClick={() => doDeleteChannel()}>Delete channel</button>
			</> : <></>}
			</>
			{/* <br/> */}
		<button className="sendButton" onClick={() => leaveRoom(chatData, socket)}>leave channel</button>
		<Modal isOpen={isOpen} onClose={onClose}>
		<ModalOverlay />
		<ModalContent>
		<ModalHeader>Banned Users</ModalHeader>
		<ModalCloseButton />
		<ModalBody>
			{bannedUsers?.map((user: User) => {
				return (
				<div className="banBox">
					<Avatar size='md' src={user.avatar} name={user.username}/>
					<div>{user.username}</div>
					<Button style={{marginLeft: 'auto'}} onClick={() => {
						setNewMode(user, 'unban');
						onClose();
					}}>Unban</Button>
				</div>
				)
			})}
		</ModalBody>
		</ModalContent>
		</Modal>
		<ToastContainer/>
			
			
			</div> : <div className="history_1">Loading...</div>}
		</div>
		</ChakraProvider>
	)
}

export default IdChatUser;
