import React from "react";
import 'react-toastify/dist/ReactToastify.css'
import { FriendData } from "./Friends";
import "./FriendMessage.css"

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
		<h2 style={{marginTop: "-6vh", paddingBottom: "1vh"}}>Friend Requests</h2>
		{requestList.map((request: FriendData) => {
			return (
			<div className="inviteGrid">
			<p>{request.requester_user.username} sent you a friend request.</p>
			<div className="buttonBox">
			<button className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
				onClick={() => onAccept(request)}>Accept</button>
			<button className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
				onClick={() => onDecline(request)}>Deny</button>
			</div>
			</div>
			)
		})}
		</div>
	  </div>
	  );
};

export default ShowMessage
