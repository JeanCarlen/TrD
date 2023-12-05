import React, { useState, useEffect } from "react";
import "./Stats.css";
import Sidebar from "../Components/Sidebar";
import LayoutGamestats from "./Layout-gamestats";
import LayoutPlayerstats from "./Layout-playerstats";
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";
import LayoutRanking from "./Layout-ranking";
import GameInvite from "../Game/Game-Invite";

export type User = {
  username: string;
  login42: string;
  avatar: string;
};

export type gameData = {
  id: number;
  score_1: number;
  score_2: number;
  status: number; // 0 = ongoing, 1 = finished
  status_text_en: string;
  status_text_fr: string;
  user_1: number;
  user_1_data: User;
  user_2: number;
  user_2_data: User;
};

const Stats: React.FunctionComponent = () => {
  const [gameFetched, setGameFetched] = useState<boolean>(false);
  const [alldata, setAllData] = useState<gameData[]>([]);
  const token: string | undefined = Cookies.get("token");
  let content: { username: string; user: number; avatar: string };

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const response = await fetch(
      `http://localhost:8080/api/matches/users/${content.user}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.ok) {
      let data = await response.json();
      data.sort((a: gameData, b: gameData) => (a.id > b.id ? 1 : -1));
      setGameFetched(true);
      setAllData(data.reverse());
    } else {
      console.log("Error fetching matches");
    }
  };

  if (token !== undefined) content = decodeToken(token);
  else
    content = {
      username: "default",
      user: 0,
      avatar: "http://localhost:8080/images/default.png",
    };

  return (
    <div className="stats-container">
      <Sidebar />
      <div className="text"></div>
      <div className="grid-stats" style={{ paddingBottom: "10vh" }}>
        {/* <h2>Match History</h2> */}
        <div className="history_1" style={{ overflowY: "auto" }}>
          <LayoutPlayerstats data={alldata} User={content} />
        </div>

        {gameFetched ? (
          <div className="history_1" style={{ width: "50vw" }}>
            {alldata.map((stat: gameData) => {
              return <LayoutGamestats display={stat} userID={content?.user} />;
            })}
          </div>
        ) : (
          <div
            className="history_1"
            style={{ fontSize: "25px", width: "50vw" }}
          >
            Loading...
          </div>
        )}
        <div className="history_1" style={{ width: "25vw" }}>
          <h2>Leaderboard</h2>
          <LayoutRanking token={token} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
