import React from "react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";
import FriendList from "./Friends";
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import { profiles } from "../Social/Profiles";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

type UserProps = {
	userID: number|undefined;
  };

const AddFriend: React.FC<UserProps> = ({userID}) => {
	// const [friends, setFriends] = useState<FriendData[]>([]);
	console.log(userID)
	const handleAddFriend = async (userID: number|undefined) => {
		const token = Cookies.get('token');
			let content: {username: string, user: number};
			if (token != undefined)
				content = decodeToken(token);
			else
			content = { username: 'default', user: 0}
		const response = await fetch(`http://localhost:8080/api/friends`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify({requester: content.user , requested: userID, status: 0})
		});
		const data = await response.json()
		console.log(data);
		toast.info("Friend request sent!")
	}

	return (
	  <div>
		<AddIcon cursor='pointer' boxSize={5} onClick={() => handleAddFriend(userID)}/>
		{/* <AddIcon boxSize={5} onClick={() => handleAddFriend()}/> */}
		{/* {friends.map((friend) => (
			<div key={friend.id}>
			<h2>{friend.requested}</h2>
			{/* <button onClick={() => handleAddFriend(friend.id)} /> */}
		 {/* </div>
		))} } */}
	  </div>
	);
  };


export default AddFriend
