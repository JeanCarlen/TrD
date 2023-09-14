import React from "react";
import './Home.css'
import Sidebar from "../Components/Sidebar";
import GameBox from "../Game/GameTry";
import PongGame from "../Game/PongGame";

const Game: React.FunctionComponent = () => {
	return (
		<div className="HomeText">
            <Sidebar/>
			Game
			<div>
				
			</div>
			<PongGame/>
		</div>
	)
}

export default Game
