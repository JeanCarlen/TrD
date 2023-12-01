import React from "react";
import Sidebar from "../Components/Sidebar";
import PongGame from "../Game/PongGame";
import GameSocket from "../Game/GameSocket";
import { useState } from "react";

const Game: React.FunctionComponent = () => {
  const [userStatus, setUserStatus] = useState<string>("offline");

  return (
    <div className="justify-center text-5xl w-full h-full">
      <Sidebar />
	  <div className="ml-[110px]">
      <GameSocket />
	  </div>
    </div>
  );
};

export default Game;
