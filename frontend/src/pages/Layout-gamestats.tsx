import React from "react";
import './Stats.css';
import { gameData, User } from "./Stats";

export type statsProps = {
	display: gameData,
	userID: number,
}

const LayoutGamestats: React.FunctionComponent<statsProps> = ({display, userID}: statsProps) => {
	
	let winLoose: string;

	if (display.score_1 > display.score_2)
	{
		if (display.user_1 === userID)
			winLoose = 'WON'
		else
			winLoose = 'LOST'
	}
	else
	{
		if (display.user_2 === userID)
			winLoose = 'WON'
		else
			winLoose = 'LOST'
	}

	return (
	<div className="game-stats">
	<div className='box' style={{fontSize:"25px"}}>{display.user_1_data.username} - {display.user_2_data.username}</div>
	<div className='box'>{display.score_1}</div>
	<div className='box'>{display.score_2}</div>
	<div className='box'>{display.status == 0 ? 'playing' : 'over'}</div>
	<div className='box' style={winLoose=='WON' ? {color:"green"} : {color:"RED"}}>{winLoose}</div>
	</div>
	)
}


export default LayoutGamestats;