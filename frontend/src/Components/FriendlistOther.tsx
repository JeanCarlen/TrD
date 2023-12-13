import { Text, List, ListItem, Flex } from "@chakra-ui/react";
import { useState } from "react";
import Cookies from "js-cookie";
import "../pages/Users.css";
import { Link } from "react-router-dom";
import "../pages/Home.css";
import { useEffect } from "react";
import React from "react";
// import decodeToken from "../helpers/helpers";
import { useParams } from "react-router-dom";
import "../pages/Stats.css";
import { WrapItem, Wrap } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import "../pages/Home.css";
import ShowStatus from "./FriendStatus";
import { FriendData } from "./Friends";
import "react-toastify/dist/ReactToastify.css";

const FriendListProfile: React.FC = () => {
  const { users } = useParams();
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [isSender, setIsSender] = useState<boolean | null>(null);
  const token = Cookies.get("token");
  const [myUserID, setmyUserID] = useState<number>();
  
  const GetUserinfo = async () => {
    const response = await fetch(
      `http://10.12.2.5:8080/api/users/username/${users}`,
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
        setFriends(data);
        if (data.length === 0)
          return ;
      }
      const response1 = await fetch(
        `http://10.12.2.5:8080/api/friends/active/list/${data[0].id}`,
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
  }, []);

  if (isSender === null) {
    // Loading state, you might display a loading spinner or message
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Friends</h2>
      <List className="friends">
        {friends && friends.map((friend: FriendData) => (
          <ListItem key={friend.requester}>
            <Flex alignItems="center">
                <Wrap>
                  <WrapItem className="profile-border">
                    <VStack spacing={4} alignItems="center">
                      {friend.requested === myUserID ? 
                      (
                        <>
                          <Link to={`/profiles/${friend.requester_user?.username}`}>
                        <Text display="flex">
                          {friend.requester_user?.username}
                        </Text><Avatar size="xs" src={friend.requester_user?.avatar} /><ShowStatus
                            status={friend.requester_user?.curr_status} />
                            </Link>
                            </>
                      ) :
                      (
                        <>
                        <Link to={`/profiles/${friend.requested_user?.username}`}>
                        <Text display="flex">
                          {friend.requested_user?.username}
                        </Text>
                        <Avatar size="xs" src={friend.requested_user?.avatar} />
                        <ShowStatus
                          status={friend.requested_user?.curr_status}/>
                        </Link>
                        </>
                      )} 
                    </VStack>
                  </WrapItem>
                </Wrap>
            </Flex>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default FriendListProfile;
