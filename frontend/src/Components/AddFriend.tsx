import React from "react";
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UserProps = {
  userID: number | undefined;
};

const AddFriend: React.FC<UserProps> = ({ userID }:UserProps) => {

  const handleAddFriend = async (userID: number | undefined) => {
    const token = Cookies.get("token");
    let content: { username: string; user: number, avatar:string };
    if (token !== undefined) content = decodeToken(token);
    else 
    {
      content = {
        username: "default",
        user: 0,
        avatar: "http://localhost:8080/images/default.png",
      }
    };
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

  return (
    <div>
	<button
		className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
		onClick={() => handleAddFriend(userID)}>
    Add friend
	</button>
    </div>
  );
};

export default AddFriend;
