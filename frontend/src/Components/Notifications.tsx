import React from 'react';
import { BellIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import './Notifications.css';
import ShowMessage from './ShowMessages';
import { useState } from 'react';
import decodeToken from '../helpers/helpers';
import Cookies from 'js-cookie';
// import { MessageProps } from './ShowMessages';

interface NotificationIconProps {
  count: number;
//   onAccept: (senderID:number|undefined) => void;
//   onDecline: (senderID:number|undefined) => void;
  message: string;
  senderID: number;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ count, message, senderID}) => {
	const [showFriendRequests, setShowFriendRequests] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
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

	const handleAcceptRequest = async(senderID:number) => {
		console.log(`Accepted friend request with ID ${senderID}`);
		const response = await fetch(`http://localhost:8080/api/friends/${senderID}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			body: JSON.stringify({status: 1})
		});
		const data = await response.json()
		if (response.ok)
		{
			console.log("accept", data)
		}
		setShowFriendRequests(false);
	  };

	  const handleDenyRequest = async(senderID:number) => {
		// Implement logic to deny the friend request
		console.log(`Denied friend request with ID ${senderID}`);
		setShowFriendRequests(false);
	  };

	return (
		<div className="notification-icon">
		<BellIcon onClick={handleFriendRequest}/>
		{count > 0 && <span className="badge">{count} </span>}
		<div>
		{showFriendRequests && (
		<ShowMessage
			message={message}
			onAccept={handleAcceptRequest}
			onDecline={handleDenyRequest}
			senderID={senderID}
			isOpen={isModalOpen}
			onClose={closeModal}
		/>
		)}
		</div>
		</div>
	);
};

export default NotificationIcon;
