import React from "react";
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { gsocket } from "../context/websocket.context"; 
import { useEffect } from "react";

type UserProps = {
  userID: number | undefined;
};

const AddFriend: React.FC<UserProps> = ({ userID }:UserProps) => {
  console.log('got here:', userID);

  const handleAddFriend = async (userID: number | undefined) => {
    const token = Cookies.get("token");
    const navigate = useNavigate();
    let content: { username: string; user: number, avatar:string };
    if (token !== undefined) content = decodeToken(token);
    else 
    {
      content = {
        username: "default",
        user: 0,
        avatar: "http://localhost:8080/images/default.png",
      }
        gsocket.disconnect();
        useEffect(()=>{
        navigate("/login");
        },[navigate])
        return ;
    };
    content = { username: "default", user: 0 };
    const response = await fetch(
      `http://localhost:8080/api/friends/add/id/${userID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          requester: content.user,
          requested: userID,
          status: "pending",
        }),
      }
    );
    const data = await response.json();
    console.log('Friend add:', data);
    if (response.ok)
      toast.success("Friend request sent!", {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-success",
      });
    else {
      toast.error(data.error, {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-error",
      });
    }
  };

//   const handleRemoveFriend = async (userID: number | undefined) => {
//     const response = await fetch(
//       `http://localhost:8080/api/friends/active/list/${userID}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + token,
//         },
//       }
//     );
//     const data = await response.json();
//     if (response.ok) {
//       console.log("friendlist", data);
//     }

    // const response1 = await fetch(`http://localhost:8080/api/friends/${}`, {
    // 	method: 'DELETE',
    // 	headers: {
    // 		'Content-Type': 'application/json',
    // 		'Authorization': 'Bearer ' + token
    // 	},
    // 	body: JSON.stringify({requester: content.user, requested: userID, status: "pending"}),
    // });
    // const data1 = await response1.json()
    // console.log("data1", data1);
//   };

  return (
    <div>
	<button
		className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
		onClick={() => handleAddFriend(userID)}
		>
    Add friend
	</button>
		{/* ADD FRIEND
      <AddIcon
        cursor="pointer"
        boxSize={5}
        onClick={() => handleAddFriend(userID)}
      /> */}
      {/* <DeleteIcon cursor='pointer' boxSize={5} onClick={() => handleRemoveFriend(userID)}/> */}
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

export default AddFriend;
