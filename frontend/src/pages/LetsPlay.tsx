import React from "react";
import './Home.css'
import Sidebar from "../Components/Sidebar";
import GameBox from "../LoginForm/GameTry";
import PongGame from "../LoginForm/PongGame";

const Game: React.FunctionComponent = () => {
	return (
		<div className="HomeText">
            <Sidebar/>
			Game
			<PongGame/>
		</div>
	)
}

export default Game
