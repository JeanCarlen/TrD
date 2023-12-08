import React from "react";
// import styled from 'styled-components'
import { ChakraProvider, WrapItem, Wrap } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import Sidebar from "../Components/Sidebar";
import "../pages/Home.css";
import { VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Searchbar from "../Components/Searchbar";
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";
import { useParams } from "react-router-dom";
import AddFriend from "../Components/AddFriend";
import { gameData } from "../pages/Stats";
import LayoutGamestats from "../pages/Layout-gamestats";
import FriendListProfile from "../Components/FriendlistOther";
import { handleBlockUser } from "../chat/idChatUser";
import { User } from "../chat/idChatUser";
import ShowStatus from "../Components/FriendStatus";
import { useNavigate } from "react-router-dom";
import { gsocket } from "../context/websocket.context";
import { FriendData } from "../Components/Friends";
import { toast } from "react-toastify";

export interface profiles {
  username: string | undefined;
}
type Props = {};

const Profiles = (props: Props) => {
  const { users } = useParams();
  const token: string | undefined = Cookies.get("token");
  const [gameFetched, setGameFetched] = useState<boolean>(false);
  const [dataMatches, setDataMatches] = useState<gameData[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [achievementName] = useState<string>("");
  const [friends] = useState<FriendData[]>([]);
  const [friendid, setFriendID] = useState<number | undefined>();
  const [friend, setFriend] = useState<User | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    GetUserinfo();
  }, []);

  const GetUserinfo = async () => {
    const response = await fetch(
      `http://localhost:8080/api/users/username/${users}`,
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
      setAvatarUrl(data[0].avatar);
      await setFriendID(data[0].id);
      console.log("friendid", data[0].id);
      setFriend(data[0]);
      await fetchMatches(data[0].id);
      console.log("avatar", avatarUrl);
    }
  };

  const fetchMatches = async (theID: number) => {
    console.log("Fetching matches for user", theID);
    const response = await fetch(
      `http://localhost:8080/api/matches/users/${theID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      try {
        let data = await response.json();
        data.sort((a: gameData, b: gameData) => (a.id > b.id ? 1 : -1));
        setGameFetched(true);
        console.log("Data fetched", data);
        setDataMatches(data.slice(-3).reverse());
      } catch (e) {
        console.log("Error in response", e);
      }
    } else {
      console.log("Error fetching matches");
    }
  };

  function SpectateGame(user: User) {
    let content;
    if (token !== undefined) content = decodeToken(token);
    else return;
    try {
      if (content.user !== user.id) {
        gsocket.emit("give-roomName", { user_id: user.id });
        console.log("spectate game :", user.id);
        navigate("/game");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const inviteToPong = async (user: User) => {
    if (token !== undefined) {
		if (friendid === user.id)
		{
			toast.error("You cannot invite yourself to play", { position: toast.POSITION.BOTTOM_LEFT, className: 'toast-error' });
			return;
		}
      let content = await decodeToken(token);
      gsocket.emit("invite", { inviter: content, invited: user });
      navigate("/game");
    }
  };

  return (
    <ChakraProvider resetCSS={false}>
      <Searchbar />
      <div>
        <Sidebar />
        <div>
          <div className="flex flex-row gap-6 justify-start items-end ml-24">
            <Wrap>
              <WrapItem className="profile-border">
                <VStack spacing={4} alignItems="center">
                  <Avatar size="2xl" src={avatarUrl} />
                  <div className="icon-container">
                    <div className="status-circle">
                      <ShowStatus status={friend?.status} />
                    </div>
                  </div>
                </VStack>
                <h1 className="welcome"> {users} </h1>
              </WrapItem>
            </Wrap>
            <div className="box-content overflow-hidden h-177 grid grid-row-2 grid-cols-2 gap-x-2 gap-y-2">
			  <AddFriend userID={friendid}/>
              <button
                className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
                onClick={() => friend && SpectateGame(friend)}
              >
                spectate
              </button>
              <button
                className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
                onClick={() => friend && inviteToPong(friend)} //TODO: add invite to play function
              >
                invite to play
              </button>
              <button
                className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
                onClick={() => handleBlockUser(friend, token)}
              >
                block {users}
              </button>
            </div>
          </div>
          <div className="displayGrid">
            <div className="matchHistory">
              match history
              <br />
              {gameFetched ? (
                <div className="matchBox">
                  {dataMatches.map((stat: gameData) => {
                    return <LayoutGamestats display={stat} userID={friendid} />;
                  })}
                </div>
              ) : (
                <div className="history_1" style={{ fontSize: "25px" }}>
                  Loading...
                </div>
              )}
            </div>
            <div className="achievements">{achievementName}</div>
            <div className="friends">
              <div className="matchBox">
                {friends.map((friend) => (
                  <FriendListProfile
                    key={friend.id}
                    id={friend.id}
                    requester={friend.requester}
                    status={friend.status}
                    requested={friend.requested}
                    requested_user={friend.requested_user}
                    requester_user={friend.requester_user}
                    total_count={friend.total_count}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default Profiles;
