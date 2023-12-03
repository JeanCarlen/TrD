import React from 'react';
import { BellIcon} from '@chakra-ui/icons'
import './Notifications.css';
import ShowMessage from './ShowMessages';
import { useState, useEffect } from 'react';
import decodeToken from '../helpers/helpers';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { gsocket } from '../context/websocket.context';
import { FriendData } from './Friends';

const NotificationIcon: React.FC = () => {
	const [showFriendRequests, setShowFriendRequests] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [requestList, setRequestList] = useState<FriendData[]>([]);
	const [counter, setCounter] = useState(0);
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number};
		if (token !== undefined)
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

	const updateFriends = async() => {
		const response = await fetch(`http://localhost:8080/api/friends/pending/list/${content.user}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		});
		const data = await response.json();
		setCounter(data.length);
		setRequestList(data);
		console.log("data", data)
		if (data.length <= 0)
		{
			setShowFriendRequests(false);
			setIsModalOpen(false);
		}
	};

	const handleAcceptRequest = async(senderName:string, senderID: number, id:number) => {
		console.log(`Accepted friend request from ${senderName}`);
		const response = await fetch(`http://localhost:8080/api/friends/${id}`, {
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
		updateFriends();
	};

	useEffect(() =>{
			updateFriends();
	}, []);

	  const handleDenyRequest = async(senderID:number, id: number) => {
		// Implement logic to deny the friend request
		console.log(`Denied friend request ${id}`);
		setShowFriendRequests(false);
		const resp = await fetch(`http://localhost:8080/api/friends/reject/${id}`, {
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
			requestList={requestList}
			onAccept={handleAcceptRequest}
			onDecline={handleDenyRequest}
			isOpen={isModalOpen}
			onClose={closeModal}

			/>
		)}
		</div>
		</div>
	);
};

export default NotificationIcon;
