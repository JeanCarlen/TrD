import React from "react";
import Sidebar from "../Components/Sidebar";
import PongGame from "../Game/PongGame";
import GameSocket from "../Game/GameSocket";
import { useState } from "react";

const Game: React.FunctionComponent = () => {
  const [userStatus, setUserStatus] = useState<string>("offline");

  return (
    <div className="justify-center text-5xl">
      <Sidebar />
      <div></div>
      <GameSocket />
    </div>
  );
};

export default Game;
