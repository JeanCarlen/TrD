import React from "react";
import 'react-toastify/dist/ReactToastify.css'
import { FriendData } from "./Friends";
import { request } from "http";
// import decodeToken from "../helpers/helpers";

type MessageProps = {
	requestList: FriendData[];
	onAccept: (senderName:string, senderID:number) => void;
	onDecline: (senderID:number) => void;
	onClose: () => void;
  };

const ShowMessage: React.FC<MessageProps> = ({requestList, onAccept, onDecline, onClose}: MessageProps) => {
	// if (!isOpen) {
	// 	return null; // If modal is not open, do not render anything
	// }

	return (
		<div className="modal-content">
		<div className="close" onClick={onClose}>
		<h2>Friend Requests</h2>
		{requestList.map((request: FriendData) => {
			<div>
			<p>{request.requester_user.username} sent you a friend request.</p>
			<button onClick={() => onAccept(request.requester_user.username, request.requester)}>Accept</button>
			<button onClick={() => onDecline(request.requester)}>Deny</button>
			</div>
		})}
		</div>
	  </div>
	  );
};

export default ShowMessage
