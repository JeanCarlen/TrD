import React from "react";
import 'react-toastify/dist/ReactToastify.css'
// import decodeToken from "../helpers/helpers";

type MessageProps = {
	message: string;
	onAccept: (senderName:string, senderID:number) => void;
	onDecline: (senderID:number) => void;
	senderID: number;
	isOpen: boolean;
	onClose: () => void;
	senderName: string;
  };

const ShowMessage: React.FC<MessageProps> = ({ message, onAccept, onDecline, senderID, isOpen, onClose, senderName}: MessageProps) => {
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
