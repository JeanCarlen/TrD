import React from "react";
import 'react-toastify/dist/ReactToastify.css'
import { FriendData } from "./Friends";
// import decodeToken from "../helpers/helpers";

type MessageProps = {
	requestList: FriendData[];
	onAccept: (request: FriendData) => void;
	onDecline: (request: FriendData) => void;
	onClose: () => void;
	isOpen: boolean;
  };

const ShowMessage: React.FC<MessageProps> = ({requestList, onAccept, onDecline, onClose, isOpen}: MessageProps) => {
	if (!isOpen) {
		return null; // If modal is not open, do not render anything
	}

	return (
		<div className="modal-content">
		<div className="close" onClick={onClose}>
		<h2>Friend Requests</h2>
		{requestList.map((request: FriendData) => {
			return (
			<div>
			<p>{request.requester_user.username} sent you a friend request.</p>
			<button onClick={() => onAccept(request)}>Accept</button>
			<button onClick={() => onDecline(request)}>Deny</button>
			</div>
			)
		})}
		</div>
	  </div>
	  );
};

export default ShowMessage
