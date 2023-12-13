import React, { useEffect, useCallback } from "react";
import { ChakraProvider, WrapItem, Wrap } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import Sidebar from "../Components/Sidebar";
import "./Home.css";
import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import decodeToken from "../helpers/helpers";
import Cookies from "js-cookie";
import Searchbar from "../Components/Searchbar";
import FriendList from "../Components/Friends";
import UserInformation from "../Components/UserInformation";
import LayoutGamestats from "./Layout-gamestats";
import { Achievement } from "./Layout-Achievements";
import LayoutAchievements from "./Layout-Achievements";
import { gameData } from "./Stats";
import { useSelector } from "react-redux";
import GetUserName from "../Components/testusername";
import MyStatus from "../Components/Status";
import GameInvite from "../Game/Game-Invite";
import { useNavigate } from "react-router-dom";

type Props = {
  username: string;
  user: number;
  avatar: string;
  status: string;
  userStatus: number;
};

const Home = (props: Props) => {
  const [gameFetched, setGameFetched] = useState<boolean>(false);
  const [achievmentFetched, setAchievmentFetched] = useState<boolean>(false);
  const [achievments, setAchievments] = useState<Achievement[]>([]);
  const [dataLast, setDataLast] = useState<gameData[]>([]);
  const mainUsername = useSelector((state: Props) => state.username);
  const userStatus = useSelector((state: Props) => state.userStatus);
  const token: string | undefined = Cookies.get("token");
  let content: { username: string; user: number; avatar: string };
  const navigate = useNavigate();

  if (token !== undefined)
  {
	content = decodeToken(token);
  }
  else
    content = {
      username: "default",
      user: 0,
      avatar: "http://10.12.2.5:8080/images/default.png",
    };

  const fetchMatches = useCallback(async () => {
    const response = await fetch(
      `http://10.12.2.5:8080/api/matches/users/${content.user}`,
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
        setDataLast(data.slice(-3).reverse());
      } catch (e) {
        console.log("Error in response", e);
      }
    } else {
      console.log("Error fetching matches");
    }
  }, [content, token]);

  const fetchAchievments = useCallback(async () => {
    const response = await fetch(
      `http://10.12.2.5:8080/api/users/id/achievments/${content.user}`,
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
  }, [content, token]);

  const updateUser = useCallback(async () => {
    const response = await fetch(
      `http://10.12.2.5:8080/api/users/${content.user}`,
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
      content.username = data.username;
      console.log(content.username);
    }
  }, [content, token]);

  useEffect(() => {
    fetchMatches();
    fetchAchievments();
    updateUser();
  }, [token]);

  const GotoGame = () => {
    navigate("/game");
  };

  return (
    <div>
      <ChakraProvider resetCSS={false}>
        <Searchbar />
        <UserInformation username={mainUsername} userStatus={userStatus} />
        <div>
          <Sidebar />
          <div>
            <div className="topBox">
              <Wrap>
                <WrapItem className="profile-border">
                  <VStack spacing={4} alignItems="center">
                    <Avatar size="2xl" src={content.avatar} />
                    <div className="icon-container">
                      <div className="status-circle">
                        <MyStatus />
                      </div>
                    </div>
                  </VStack>
                  <GetUserName username={content.username} />
                </WrapItem>
              </Wrap>
              <button
                className="rounded-full bg-fuchsia-900 p-1.5 shadow border-0 text-2xl text-white h-36 w-48 hover:bg-stone-700"
                onClick={() => GotoGame()}
              >
                Quick Play
              </button>
            </div>
            <div className="displayGrid">
              <div className="matchHistory">
                <p>Match History</p>
                <br />
                {gameFetched ? (
                  <div className="matchBox">
                    {dataLast.map((match: gameData) => {
                      return (
                        <LayoutGamestats
                          display={match}
                          userID={content.user}
                        />
                      );
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
                <FriendList />
              </div>
            </div>
          </div>
        </div>
      </ChakraProvider>
      <GameInvite />
    </div>
  );
};

export default Home;
