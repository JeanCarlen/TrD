import React from "react";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";
import { useState } from "react";

type MessageProps = {
	message: string;
	onAccept: (senderName:string, senderID:number) => void;
	onDecline: (senderID:number) => void;
	senderID: number;
	isOpen: boolean;
	onClose: () => void;
	senderName: string;
  };

const ShowMessage: React.FC<MessageProps> = ({ message, onAccept, onDecline, senderID, isOpen, onClose, senderName}) => {
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number};
		if (token != undefined)

		{
			content = decodeToken(token);
		}
		else
			content = { username: 'default', user: 0};
		if (!isOpen) {
			return null; // If modal is not open, do not render anything
			}

	return (
		<div className="modal-content">
		<div className="close" onClick={onClose}>
			<h2>Friend Requests</h2>
		{/* <ul> */}
			  <p>{senderName} sent you a friend request.</p>
			  <button onClick={() => onAccept(senderName, senderID)}>Accept</button>
			  <button onClick={() => onDecline(senderID)}>Deny</button>
		</div>
		  {/* {friendRequests.map((request, index) => ( */}
			{/* <li key={index}> */}
			{/* </li>
		  ))} */}
		{/* </ul> */}
	  </div>
	  );
};

export default ShowMessage
