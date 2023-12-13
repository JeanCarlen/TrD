import { useState } from "react";
import Cookies from "js-cookie";
import "../pages/Users.css";
import { Link } from "react-router-dom";
import "../pages/Home.css";
import { useEffect } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import "../pages/Stats.css";
import { WrapItem } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import "../pages/Home.css";
import ShowStatus from "./FriendStatus";
import { FriendData } from "./Friends";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const FriendListProfile: React.FC = () => {
  const { users } = useParams();
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [isSender, setIsSender] = useState<boolean | null>(null);
  const token = Cookies.get("token");
  const [myUserID, setmyUserID] = useState<number>();
  const navigate = useNavigate();
  
  const GetUserinfo = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}api/users/username/${users}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
      );
      const data = await response.json();
      if (response.ok) {
        // setFriends(data);
        if (data.length === 0)
          return ;
      }
      const response1 = await fetch(
        `${process.env.REACT_APP_HOST}api/friends/active/list/${data[0].id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
        );
        const data1 = await response1.json();
        if (response1.ok) {
          setFriends(data1);
        setmyUserID(data[0].id);

      if (data1[0] !== undefined)
        setIsSender(data[0].username === data1[0].requester_user.username);
    }
  };

  useEffect(() => {
    GetUserinfo();
  }, [users]);

  const navigation = (user: string) => {
    navigate(`/profiles/${user}`);
  };

  if (isSender === null) {
    // Loading state, you might display a loading spinner or message
    return <p>Loading...</p>;
  }

  return (
    <div className="justify-center">
    <h2 className="text-2xl font-bold mb-4">Friends</h2>
    <div className="flex inline-grid grid-cols-4 gap-2 justify-center">
        {friends && friends.map((friend: FriendData) => (
          <li key={friend.requester} className="flex items-center space-x-4">
                  <WrapItem className="p-4 border-2 border-gray-200 rounded-lg">
                      {friend.requested === myUserID ? 
                      (
                        <>
                          <Link onClick={() => navigation(friend.requester_user?.username)} to={`/profiles/${friend.requester_user?.username}`}>
                          <span className="text-lg ">{friend.requester_user?.username}</span>
                        <Avatar size="xs" src={friend.requester_user?.avatar} />
                        <ShowStatus
                            status={friend.requester_user?.curr_status} />
                            </Link>
                            </>
                      ) :
                      (
                        <>
                        <Link onClick={() => navigation(friend.requested_user?.username)}to={`/profiles/${friend.requested_user?.username}`}>
                          <span className="text-lg ">{friend.requested_user?.username}</span>
                        <Avatar size="xs" src={friend.requested_user?.avatar} />
                        <ShowStatus
                          status={friend.requested_user?.curr_status}/>
                        </Link>
                        </>
                      )} 
                  </WrapItem>
                  </li>
        ))}
    </div>
    </div>
  );
};

export default FriendListProfile;
