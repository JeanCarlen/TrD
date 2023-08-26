import React from "react";
import './Home.css'
import Sidebar from "../Components/Sidebar";
import GameBox from "../LoginForm/GameTry";

const Game: React.FunctionComponent = () => {
	return (
		<div className="HomeText">
            <Sidebar/>
			Game
			<GameBox/>
		</div>
	)
}

export default Game
