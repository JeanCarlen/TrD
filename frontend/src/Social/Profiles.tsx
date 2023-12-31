import React, { useState, useEffect } from "react";
// import styled from 'styled-components'
import { ChakraProvider, WrapItem, Wrap } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import Sidebar from "../Components/Sidebar";
import "../pages/Home.css";
import { VStack } from "@chakra-ui/react";
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
// import { FriendData } from "../Components/Friends";
import { toast } from "react-toastify";
import { Achievement } from "../pages/Layout-Achievements";
import LayoutAchievements from "../pages/Layout-Achievements";
import MoveAction from "../moveAction";

export interface profiles {
  username: string | undefined;
}
type Props = {};

const Profiles = (props: Props) => {
  const { users } = useParams();
  const token: string | undefined = Cookies.get("token");
  let content: { username: string; user: number; avatar: string };
  const [gameFetched, setGameFetched] = useState<boolean>(false);
  const [dataMatches, setDataMatches] = useState<gameData[]>([]);
  const [achievmentFetched, setAchievmentFetched] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  // const [achievementName] = useState<string>("");
  const [achievments, setAchievments] = useState<Achievement[]>([]);
  // const [friends] = useState<FriendData[]>([]);
  const [friendid, setFriendID] = useState<number | undefined>();
  const [friend, setFriend] = useState<User | undefined>();
  const navigate = useNavigate();

  if (token !== undefined) content = decodeToken(token);
  else {
    content = {
      username: "default",
      user: 0,
      avatar: `${process.env.REACT_APP_HOST}images/default.png`,
    };
  }

  useEffect(() => {
    fetchAchievements();
    GetUserinfo();
  }, [users]);

  const fetchAchievements = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}api/users/id/achievments/${content.user}`,
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
        setAchievmentFetched(true);
        setAchievments(data);
      } catch (e) {
        console.log("Error in response achievments", e);
      }
    } else {
      console.log("Error fetching achievments");
    }
  };

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
      if (data.length === 0) {
        toast.error("User does not exist", {
          position: toast.POSITION.BOTTOM_LEFT,
          className: "toast-error",
        });
        navigate("/Home");
        return;
      } else {
        setAvatarUrl(data[0].avatar);
        await setFriendID(data[0].id);
        setFriend(data[0]);
        await fetchMatches(data[0].id);
      }
    }
  };

  const fetchMatches = async (theID: number) => {
    console.log("Fetching matches for user", theID);
    const response = await fetch(
      `${process.env.REACT_APP_HOST}api/matches/users/${theID}`,
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
        navigate("/game");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const inviteToPong = async (user: User) => {
    if (token !== undefined) {
      let content = await decodeToken(token);
      if (friendid === content?.user) {
        toast.error("You cannot invite yourself to play", {
          position: toast.POSITION.BOTTOM_LEFT,
          className: "toast-error",
        });
        return;
      }
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
              <AddFriend userID={friendid} />
              <button
                className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
                onClick={() => friend && SpectateGame(friend)}
              >
                Spectate
              </button>
              <button
                className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
                onClick={() => friend && inviteToPong(friend)} //TODO: add invite to play function
              >
                Invite to play
              </button>
              <button
                className="bg-stone-50 hover:bg-stone-500 text-black font-bold py-2 px-4 rounded mb-4"
                onClick={() => handleBlockUser(friend, token)}
              >
                Block {users}
              </button>
            </div>
          </div>
          <div className="displayGrid">
            <div className="matchHistory">
              Match history
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
            <div className="achievements">
              <p>Achievements</p>
              <br />
              {achievmentFetched ? (
                <div className="matchBox">
                  {achievments.map((achievment: Achievement) => {
                    return <LayoutAchievements display={achievment} />;
                  })}
                </div>
              ) : (
                <div className="history_1" style={{ fontSize: "25px" }}>
                  Loading...
                </div>
              )}
            </div>
            <div className="friends">
              <div className="matchBox">
                <FriendListProfile />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MoveAction />
    </ChakraProvider>
  );
};

export default Profiles;
