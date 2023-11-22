import React from 'react';
import { BellIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import './Notifications.css';
import ShowMessage from './ShowMessages';
import { useState, useEffect } from 'react';
import decodeToken from '../helpers/helpers';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { gsocket } from '../context/websocket.context';
// import { MessageProps } from './ShowMessages';

interface NotificationIconProps {
  count: number;
  onAccept: (senderID:number|undefined) => void;
//   onDecline: (senderID:number|undefined) => void;
  message: string;
  senderName: string;
  senderID: Array<number>;
  pendingfriends: Array<number>;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ count, message, senderName, senderID, pendingfriends}) => {
	const [showFriendRequests, setShowFriendRequests] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [counter, setCounter] = useState(0);
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number};
		if (token != undefined)
			content = decodeToken(token);
		else
			content = { username: 'default', user: 0};
	const handleFriendRequest = () => {
		setShowFriendRequests(!showFriendRequests);
		setIsModalOpen(true);
	}

	  const closeModal = () => {
		setIsModalOpen(false);
	  };
console.log("senderID length", pendingfriends.length);
	  const updateFriends = async() => {
		const response = await fetch(`http://localhost:8080/api/friends/pending/list/${content.user}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		});
		const data = await response.json()
		setCounter(data.length);
		console.log("data", data)
		console.log("count", counter)
		console.log("ID",senderID);
		console.log("name", senderName);
		console.log("requestID", pendingfriends);
		if (data.length <= 0)
		{
			setShowFriendRequests(false);
			setIsModalOpen(false);
		}
	};

	const handleAcceptRequest = async(senderName:string, senderID: number) => {
		console.log(`Accepted friend request from ${senderName}`);
		console.log("request", pendingfriends);
		const response = await fetch(`http://localhost:8080/api/friends/${pendingfriends}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			body: JSON.stringify({status: 1})
		});
		const data = await response.json()
		console.log("accept", data)
		if (response.status === 409) {
			toast.error(data.message, {
				position: toast.POSITION.TOP_CENTER
			});
		}
		else {
			toast.success('You are now friends', {
				position: toast.POSITION.TOP_CENTER
			});
			gsocket.emit('create-room', {
				roomName: `1on1-${senderID}${content.user}`,
				client: content?.user,
				Password: null,
			});
		}
		setShowFriendRequests(false);
		setIsModalOpen(false);
		setCounter(counter - 1);
		pendingfriends = pendingfriends - 1;
		updateFriends();
	};

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
			updateFriends();

		}, []);

	  const handleDenyRequest = async(senderID:number) => {
		// Implement logic to deny the friend request
		console.log(`Denied friend request from ${senderName}`);
		setShowFriendRequests(false);
		const resp = await fetch(`http://localhost:8080/api/friends/reject/${pendingfriends}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
		}
		});
		const data2 = await resp.json()
		console.log("reject", data2);
		if (resp.ok )
			{
				setCounter(data2.length);			
				console.log(data2);
	  		}
			updateFriends();
	  };

	return (
		<div className="notification-icon">
		<BellIcon onClick={handleFriendRequest}/>
		{ <span className="badge">{counter} </span>}
		<div>
		{showFriendRequests && (
			<ShowMessage
			message={message}
			onAccept={handleAcceptRequest}
			onDecline={handleDenyRequest}
			senderID={senderID}
			senderName={senderName}
			isOpen={isModalOpen}
			onClose={closeModal}
			pendingfriends={pendingfriends}
			/>
		)}
		</div>
		</div>
	);
};

export default NotificationIcon;
