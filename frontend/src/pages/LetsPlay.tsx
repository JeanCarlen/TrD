import React from "react";
import Sidebar from "../Components/Sidebar";
import GameSocket from "../Game/GameSocket";

const Game: React.FunctionComponent = () => {

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
