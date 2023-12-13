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
import { useNavigate } from "react-router-dom";

const NotificationIcon: React.FC = () => {
	const [showFriendRequests, setShowFriendRequests] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [requestList, setRequestList] = useState<FriendData[]>([]);
	const [counter, setCounter] = useState(0);
	const navigate = useNavigate();
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number, avatar:string};
		if (token !== undefined)
			content = decodeToken(token);
		else
		{
			content = {
			  username: "default",
			  user: 0,
			  avatar: "http://localhost:8080/images/default.png",
			}
		  };
		
	const handleFriendRequest = () => {
		setShowFriendRequests(!showFriendRequests);
		setIsModalOpen(true);
		updateFriends();
	}

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const updateFriends = (async () => {
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
		// 
		if (data.length <= 0)
		{
			setShowFriendRequests(false);
			setIsModalOpen(false);
		}
	});

	const handleAcceptRequest = async(request: FriendData) => {
		
		const response = await fetch(`http://localhost:8080/api/friends/${request.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			body: JSON.stringify({status: 1})
		});
		const data = await response.json()
		
		if (!response.ok) {
			toast.error(data.message, {
				position: toast.POSITION.TOP_CENTER
			});
		}
		else {
			toast.success('You are now friends', {
				position: toast.POSITION.TOP_CENTER
			});
			await gsocket.emit('create-1on1', {
				roomName: `[1on1]-${request.requester}-${request.requested}`,
				requester: request.requester,
				requested: request.requested,
			});
		}
		setShowFriendRequests(false);
		setIsModalOpen(false);
		updateFriends();
	};

	useEffect(() =>{
			updateFriends();
	}, []);

	  const handleDenyRequest = async(request: FriendData) => {
		// Implement logic to deny the friend request
		
		setShowFriendRequests(false);
		const resp = await fetch(`http://localhost:8080/api/friends/reject/${request.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
		}
		});
		const data2 = await resp.json()
		
		if (resp.ok )
			{
				setCounter(data2.length);
				
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
