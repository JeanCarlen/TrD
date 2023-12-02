import React from "react";
import './Home.css'
import Sidebar from "../Components/Sidebar";
import GameSocket from "../Game/GameSocket";

const Game: React.FunctionComponent = () => {

	return (
		<div className="HomeText">
            <Sidebar/>
			<div>
			</div>
			{/* <PongGame/> */}
			<GameSocket/>
		</div>
	)
}

export default Game
