import React from "react";
import './Home.css'
import Sidebar from "../Components/Sidebar";
import PongGame from "../Game/PongGame";
import GameSocket from "../Game/GameSocket";
import { useState } from "react";

const Game: React.FunctionComponent = () => {
const [userStatus, setUserStatus] = useState<string>('offline');

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
