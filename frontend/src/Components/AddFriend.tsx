import React from "react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";
import FriendList from "./Friends";
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import { profiles } from "../Social/Profiles";

const AddFriend = () => {
	const [friends, setFriends] = useState<FriendData[]>([]);
	const handleAddFriend = async (username: string) => {
		const token = Cookies.get('token');
			let content: {username: string, user: number};
			if (token != undefined)
				content = decodeToken(token);
			else
			content = { username: 'default', user: 0}
		console.log("recieved: ",username);
		const response = await fetch(`http://localhost:8080/api/users/username/${username}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
		});
		const data = await response.json()
		if (response.ok)
		{
			console.log("data: ", data[0]);
			const userID = data[0].username;
		}

		// 	const response1 = await fetch('https://localhost:8080/api/friends',
		// 	{ method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'Authorization': 'Bearer ' + token,
		// 	},
		// 	body: JSON.stringify({requester: content.user , requested: userID})
		// });
		// const data1: FriendData = await response1.json()
		// if (response1.ok)
		// {
		// 	console.log(data1);
			// setFriends([...friends, data1]);
		// }
	}
	// const handleAddFriend = (friendName: string) => {
	//   // Implement the logic to add a friend here
	//   // You can update the state or make an API call to add the friend
	//   console.log(`Added ${friendName} as a friend.`);
	// };
	return (
	  <div>
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
